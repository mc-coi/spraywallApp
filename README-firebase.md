# Firebase Setup — Shared Climbs

This makes the app stop being "one browser's memory" and become a shared
library: you seed the holds once, you set climbs, and **everyone who opens
the app sees them instantly, no file passing.**

The app works WITHOUT this (local/demo mode). Firebase only turns on once
you paste a real config below. Until then nothing breaks.

## The model (read this first)

- **Holds** = the fixed map of the wall (~250 positions). Uploaded **once**,
  by you. Everyone reads them. They only change if the wall is physically
  re-set.
- **Climbs** = the living part. When you (an unlocked Setter) save a climb,
  it writes to Firebase and appears on every device in real time.
- **Read is open to everyone. Writing is gated by a setter passphrase**
  that you hold. Students can browse and climb with zero login; they can't
  alter the library unless you give them the passphrase.

This is intentionally a *soft* gate (good against a curious student tapping
around, not against a determined attacker). It can be upgraded to real
Firebase Auth later without rebuilding the app.

## One-time setup (~10 min)

### 1. Create the project
1. Go to https://console.firebase.google.com → **Add project**.
2. Name it (e.g. `stem-spraywall`). Disable Google Analytics (not needed).

### 2. Create the Realtime Database
1. Left menu → **Build → Realtime Database → Create Database**.
2. Pick the location closest to you (US).
3. Start in **locked mode** (we set proper rules next).

### 3. Set the security rules
In Realtime Database → **Rules** tab, paste exactly this and Publish:

```json
{
  "rules": {
    "wall": {
      ".read": true,
      "holds": {
        ".write": "newData.exists() == false || auth != null || true"
      },
      "climbs": {
        ".write": true
      }
    }
  }
}
```

> Note: these rules allow open writes because the app gates setting with
> the passphrase on the client side. This is the right tradeoff for a
> classroom wall on the free tier. If you later want hard server-side
> protection, enable Firebase Auth and change `.write` to `"auth != null"`
> — tell me and I'll wire the login.

### 4. Get your config
1. Project Settings (gear icon) → **General** tab.
2. Scroll to **Your apps** → click the **Web** icon `</>`.
3. Register the app (any nickname). Firebase shows a `firebaseConfig`
   object. Copy those values.

### 5. Paste it into the app
Open `index.html`, find the `window.FIREBASE_CONFIG` block near the top,
and replace each `PASTE_...` value with yours. Also change
`window.SETTER_PASSPHRASE` to your own phrase.

### 6. Deploy & seed the holds (one time)
1. Re-upload the folder to GitHub Pages (you bumped to `spraywall-v2`,
   so phones will get the new version).
2. Open the live app on your computer.
3. Click **🔒 Setter** → enter your passphrase. It unlocks (turns green).
4. Switch to **Set mode → Import** → choose your `spraywall-holds.json`
   from the tagger.
5. It asks: *"Upload these N holds to the cloud?"* → **Yes**. Done — the
   wall map is now shared with every device, permanently.

From now on: anyone opens the app → sees the wall + all climbs. You unlock
Setter on your phone → set climbs → they appear for everyone live.

## The status pill (top of the app)

- `local` (grey) — no Firebase config yet, demo data, nothing synced.
- `cloud ◌` (amber) — connecting.
- `cloud ●` (green) — connected, showing shared climbs live.
- `cloud ✕` (red) — connected but a read failed (check rules / network).

## Free tier is fine

Realtime Database Spark (free) plan: 1 GB stored, 10 GB/month download.
Climbs are tiny JSON (a name, grade, and a list of hold IDs). A whole
school's worth of climbs is a few hundred KB. You will not approach the
limits. (This matches what you confirmed earlier for the ~14-staff app.)

## Updating the app later

Any time you change `index.html`, also bump `CACHE_VERSION` in `sw.js`
(it's currently `spraywall-v2` → go to `-v3`, etc.) or installed phones
keep serving the stale cached version.
