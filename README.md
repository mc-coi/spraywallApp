# STEM Spray Wall — PWA

An installable, offline-capable version of the spray wall app. Once deployed
and added to your phone's home screen, it opens full-screen with no browser
bar and works at the wall even with no signal.

## What's in this folder

| File | Purpose |
|---|---|
| `index.html` | The app (climb viewer + set mode + generator). Image is now external. |
| `wall.jpg` | The wall photo, loaded as a cached asset. |
| `manifest.webmanifest` | Tells the phone it's an installable app (name, icons, colors). |
| `sw.js` | Service worker — caches everything so it works offline. |
| `icon-*.png`, `apple-touch-icon.png`, `favicon.png` | Home-screen icons. |

## Why this can't be a single file

A PWA only becomes installable when served over **HTTPS from a real URL**.
Opening `index.html` from your computer (a `file://` path) will run the app
but the service worker and "Add to Home Screen" will NOT work. It must be
hosted. GitHub Pages (which you already use) is perfect and free.

## Deploy to GitHub Pages (5 minutes)

1. Create a new repository, e.g. `spraywall`.
2. Upload **every file in this folder** to the repo root (not in a subfolder).
3. Repo **Settings → Pages** → Source: `Deploy from a branch` →
   Branch: `main`, Folder: `/ (root)` → Save.
4. Wait ~1 minute. Your app is live at:
   `https://YOUR-USERNAME.github.io/spraywall/`

The paths in this app are **relative**, so it works whether the URL is
`username.github.io/spraywall/` (project site) or `username.github.io/`
(root site) — no edits needed.

## Install on a phone

- **iPhone (Safari):** open the URL → Share button → *Add to Home Screen*.
- **Android (Chrome):** open the URL → menu (⋮) → *Install app* /
  *Add to Home Screen*.

It then launches like a native app, full-screen, and works offline.

## Updating the app later

Browsers cache PWAs aggressively. When you change `index.html` or `wall.jpg`,
**also bump the version** in `sw.js`:

```js
const CACHE_VERSION = 'spraywall-v1';   // change to 'spraywall-v2', etc.
```

Re-upload. Phones will fetch the new version on next launch instead of
serving the stale cache. If you don't bump it, people keep seeing the old app.

## Known limitations (unchanged from the standalone app)

- **No multi-device sync yet.** Climbs you set live only in that browser's
  memory and are lost on refresh unless you Export the JSON. Sharing climbs
  across phones / with students needs the Firebase layer (next build step).
- **Generated grades are a shape guess, not a measurement** — climb and
  re-grade by feel.
- Replace the placeholder hold grid by importing your real
  `spraywall-holds.json` from the tagger (Set mode → Import).
