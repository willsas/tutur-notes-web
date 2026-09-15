# tutur-notes-web

The marketing, privacy, terms and support site for **Tutur Notes**, the iOS
journaling app in `../tutur-notes-ios`. Plain static HTML and CSS — no build
step, no dependencies, no framework.

```
├── index.html          landing page      → App Store "Marketing URL" (optional field)
├── privacy.html        privacy policy    → App Store "Privacy Policy URL" (required)
├── terms.html          terms / EULA      → linked from the app and the footer
├── support.html        support page      → App Store "Support URL" (required)
├── config.js           ← the only file you edit for contact details
├── robots.txt
├── assets/
│   ├── css/site.css
│   ├── js/config-apply.js
│   └── img/            app icon, favicons, and the five App Store screenshots
└── scripts/
    └── check-config.mjs   pre-submission check
```

## Editing content

**All replaceable values live in `config.js`.** Change an email or a domain
there once and it updates on every page, in the legal prose, in the footers and
in the `mailto:` links. Nothing else needs touching.

Pages read it through three mechanisms, all handled by
`assets/js/config-apply.js`:

| In the HTML | Effect |
| --- | --- |
| `{{supportEmail}}` | replaced in place, anywhere in the text |
| `data-cfg-href="mailto:supportEmail"` | sets the `href` |
| `data-cfg-if="appStoreUrl"` | element is dropped when the value is empty |
| `data-cfg-unless="appStoreUrl"` | element is dropped when the value is set |

The last two are what swap the live App Store button for the "Coming soon"
state. Fill in `appStoreUrl` after the app is approved and every download
button on the site becomes a real link at once.

## Before you submit

```bash
node scripts/check-config.mjs
```

It lists every value still set to `REPLACE_ME`, warns about anything left
empty, and prints the App Store Connect checklist. It exits non-zero until the
required values are filled in.

Four values are required: `legalName`, `supportEmail`, `privacyEmail` and
`siteUrl`.

## Previewing locally

```bash
python3 -m http.server 8899
```

Then open <http://localhost:8899>. Opening the files directly with `file://`
works too, but a server matches production more closely.

## Deploying

Any static host will do. The site is four HTML files and a folder of images.

**Cloudflare Pages / Netlify** — connect the repository, leave the build
command empty, set the publish directory to the repository root.

**GitHub Pages** — push to GitHub, then Settings → Pages → Deploy from a
branch → `main` / root. Your URLs become
`https://<user>.github.io/tutur-notes-web/privacy.html` and so on, which App
Review accepts.

**Vercel** — `vercel deploy` from this directory; it detects a static site.

Whatever you pick, the pages must be reachable over **HTTPS** and must stay up.
A privacy or support URL that 404s is a rejection.

## What App Store Connect asks for

| Field | Value |
| --- | --- |
| Privacy Policy URL *(required)* | `<domain>/privacy.html` |
| Support URL *(required)* | `<domain>/support.html` |
| Marketing URL *(optional)* | `<domain>/` |

Two further things that are easy to miss:

- **App Privacy** in App Store Connect must be answered. For this app the
  answer is **Data Not Collected** across the board — nothing is transmitted
  off the device, and the private CloudKit database is the user's own. Answer
  it honestly against `privacy.html`; a mismatch between the two is a common
  rejection.
- **Guideline 5.1.1(i)** requires a privacy policy link *inside the app* as
  well as in the metadata field. Add a row in the app's Settings screen
  pointing at `<domain>/privacy.html`.

## Before launch: the App Store badge

The "Download on the App Store" badge on `index.html` is drawn inline as SVG so
the page needs no network request and scales cleanly. Apple's marketing
guidelines ask you to use their supplied artwork. Download the official badge
from Apple's marketing resources and swap it into the `.appstore` markup in
`index.html` before you launch — keep the `data-cfg-if` / `data-cfg-unless`
attributes on the wrappers so the coming-soon behaviour still works.

## Keeping the screenshots current

The five phone images in `assets/img/screens/` are downscaled copies of the raw
captures in `../tutur-notes-ios/design-claude/app-store/screenshots/iphone-6.9/`.
After a UI change, regenerate those (see that folder's `README.md`) and then:

```bash
for f in ../tutur-notes-ios/design-claude/app-store/screenshots/iphone-6.9/*.png; do
  sips --resampleWidth 660 "$f" --out "assets/img/screens/$(basename "$f")"
done
```

## A note on accuracy

The copy on `index.html` describes only what the shipping build actually does.
Two features exist in the codebase but are switched off in `FeatureFlags.swift`
— Apple Intelligence persona replies (`intelligenceEnabled`) and the theme
picker (`themePickerEnabled`) — and neither is mentioned or implied anywhere on
the site. If you turn either flag on, update the landing page and
`privacy.html` §7 to match. Describing a feature the build does not have is a
metadata rejection under guideline 2.3.
