/* ============================================================================
 * Tutur Notes — site configuration
 *
 * THIS IS THE ONLY FILE YOU EDIT to change contact details, domain or links.
 * Every page reads from here at load time. Change a value once, it updates
 * across the landing page, the privacy policy, the terms and the support page.
 *
 * Anything still marked REPLACE_ME must be filled in before you submit to the
 * App Store. Run `node scripts/check-config.mjs` to list what is outstanding.
 * ==========================================================================*/

window.TUTUR = {

  /* --- Identity ----------------------------------------------------------
   * legalName is who stands behind the app in the legal documents. Use your
   * registered business name if you have one, otherwise your full legal name —
   * it must match the seller name on your App Store listing.
   */
  appName:      'Tutur Notes',
  tagline:      'Journaling that feels like texting someone.',
  legalName:    'REPLACE_ME_LEGAL_NAME',

  /* --- Where the site lives ----------------------------------------------
   * No trailing slash. Used for canonical URLs and social previews only;
   * every link between pages is relative, so the site works on any host even
   * if you leave this alone.
   */
  siteUrl:      'https://REPLACE_ME_DOMAIN.com',

  /* --- Contact -----------------------------------------------------------
   * supportEmail is what Apple's reviewer will use, and what appears on the
   * support page and in both legal documents. It must be an address you
   * actually read — App Review checks that the support route is real.
   *
   * privacyEmail can be the same address; split it only if you want privacy
   * requests going somewhere separate.
   */
  supportEmail: 'REPLACE_ME_EMAIL',
  privacyEmail: 'REPLACE_ME_EMAIL',

  /* How quickly you promise to answer. Keep it honest and achievable — this
   * is a promise a reviewer can hold you to. */
  responseTime: 'within 2 business days',

  /* --- App Store ---------------------------------------------------------
   * Leave appStoreUrl empty until the app is live. While it is empty every
   * download button on the site renders as a non-clickable "Coming soon to
   * the App Store" state instead of a dead link — which is what you want for
   * the marketing URL you hand to App Review before approval.
   *
   * Once live, paste the full listing URL, e.g.
   *   https://apps.apple.com/app/tutur-notes/id1234567890
   */
  appStoreUrl:  '',

  /* Shown in the support page's "before you write in" box. */
  minimumOS:    'iOS 26 or later',

  /* --- Legal document dates ----------------------------------------------
   * Update both whenever you materially change a policy. Format them however
   * you like; they are printed verbatim.
   */
  effectiveDate: '13 September 2026',
  lastUpdated:   '13 September 2026',

  /* --- Optional social ---------------------------------------------------
   * Leave empty to hide the link entirely. No placeholder is rendered.
   */
  twitterUrl:   '',
  githubUrl:    ''
};
