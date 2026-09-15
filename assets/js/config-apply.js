/* ============================================================================
 * Reads config.js and applies it to the page. You should not need to edit this.
 *
 * Three mechanisms, in the order you will meet them in the HTML:
 *
 *   {{supportEmail}}              a token anywhere in text — replaced in place.
 *                                 Used heavily in the legal prose.
 *
 *   data-cfg-href="supportEmail"  sets href from a config value. Prefix the
 *                                 value with mailto: by writing
 *                                 data-cfg-href="mailto:supportEmail".
 *
 *   data-cfg-if="appStoreUrl"     element is removed when the value is empty.
 *   data-cfg-unless="appStoreUrl" element is removed when the value is set.
 *                                 Together these swap the live App Store link
 *                                 for the "coming soon" state.
 * ==========================================================================*/
(function () {
  'use strict';

  var cfg = window.TUTUR || {};

  function value(key) {
    var v = cfg[key];
    return v === undefined || v === null ? '' : String(v);
  }

  /* An unfilled placeholder should not be treated as a real value: the App
   * Store button must stay in its "coming soon" state rather than linking to
   * the literal string REPLACE_ME_DOMAIN. */
  function isSet(key) {
    var v = value(key).trim();
    return v !== '' && v.indexOf('REPLACE_ME') === -1;
  }

  /* --- Conditionals ------------------------------------------------------
   * Done before token substitution so we never bother rewriting text inside
   * a branch that is about to be dropped. */
  function applyConditionals(root) {
    root.querySelectorAll('[data-cfg-if]').forEach(function (el) {
      if (!isSet(el.getAttribute('data-cfg-if'))) el.remove();
    });
    root.querySelectorAll('[data-cfg-unless]').forEach(function (el) {
      if (isSet(el.getAttribute('data-cfg-unless'))) el.remove();
    });
  }

  /* --- Attributes -------------------------------------------------------- */
  function applyAttributes(root) {
    root.querySelectorAll('[data-cfg-href]').forEach(function (el) {
      var spec = el.getAttribute('data-cfg-href');
      var mailto = spec.indexOf('mailto:') === 0;
      var key = mailto ? spec.slice(7) : spec;
      if (!isSet(key)) return;
      el.setAttribute('href', (mailto ? 'mailto:' : '') + value(key));
    });

    root.querySelectorAll('[data-cfg-text]').forEach(function (el) {
      var key = el.getAttribute('data-cfg-text');
      if (isSet(key)) el.textContent = value(key);
    });
  }

  /* --- {{token}} substitution --------------------------------------------
   * Walks text nodes only, so a token can sit mid-sentence in a paragraph of
   * legal prose without needing a wrapper element. Script and style contents
   * are skipped. */
  var TOKEN = /\{\{\s*([A-Za-z0-9_]+)\s*\}\}/g;

  function applyTokens(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var tag = node.parentNode && node.parentNode.nodeName;
        if (tag === 'SCRIPT' || tag === 'STYLE') return NodeFilter.FILTER_REJECT;
        return node.nodeValue.indexOf('{{') === -1
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT;
      }
    });

    var pending = [];
    while (walker.nextNode()) pending.push(walker.currentNode);

    pending.forEach(function (node) {
      node.nodeValue = node.nodeValue.replace(TOKEN, function (match, key) {
        return key in cfg ? value(key) : match;
      });
    });
  }

  /* --- Head: canonical, social preview, title ----------------------------
   * og:title and og:description are already static in every page, so a
   * link preview reads correctly even in the crawlers that skip JavaScript.
   * Only the canonical and og:url values are filled in here; hard-code them in
   * the HTML if you ever need them to survive a JS-less fetch. */
  function applyHead() {
    if (!isSet('siteUrl')) return;
    var base = value('siteUrl').replace(/\/+$/, '');
    var path = window.location.pathname.split('/').pop() || 'index.html';

    var canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', base + '/' + path);

    var ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', base + '/' + path);

    var ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute('content', base + '/assets/img/icon-512.png');
  }

  function apply() {
    applyConditionals(document.body);
    applyAttributes(document.body);
    applyTokens(document.body);
    applyTokens(document.head);
    applyHead();
    document.documentElement.setAttribute('data-config-applied', 'true');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
