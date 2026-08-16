# download.amsol.ca

The public download page for Advanced Management Solutions desktop apps, served by
GitHub Pages at <https://download.amsol.ca>.

**This repository contains no installer files.** It is only HTML, CSS, JS and images.
Every download button points at a GitHub Releases asset in the app's own repository:

| App | Repository | Files |
|---|---|---|
| Magic PDF | [alaahadyhostinger/magicpdf](https://github.com/alaahadyhostinger/magicpdf/releases) | `magicpdf-setup.exe`, `magicpdf-macos.dmg` |
| Magic Video | [alaahadyhostinger/magicvideo](https://github.com/alaahadyhostinger/magicvideo/releases) | `magicvideo-setup.exe`, `magicvideo-macos.dmg` *(pending)* |

## Layout

```
.
├── index.html              the download page
├── 404.html                styled not-found page
├── docker-compose.yml      Coolify deployment (the live one)
├── Dockerfile              nginx image containing the static files
├── nginx.conf              routing, gzip, cache headers, /healthz
├── .dockerignore
├── CNAME                   custom domain, GitHub Pages only
├── .nojekyll               GitHub Pages only: skip Jekyll processing
├── robots.txt
├── sitemap.xml
└── assets/
    ├── css/style.css       palette matches the Magic PDF app (src/theme.py)
    ├── js/main.js          progressive enhancement only - see below
    └── img/
        ├── ams-logo-blue.png    header logo, light theme
        ├── ams-logo-white.png   header logo, dark theme
        ├── magicpdf-icon.png    Magic PDF app icon
        ├── favicon.ico
        └── favicon.png
```

The Magic Video icon is inline SVG in `index.html` — there is no raster file for it.

## Why the download links never need editing

Every button uses GitHub's `releases/latest/download/<filename>` form, for example:

```
https://github.com/alaahadyhostinger/magicpdf/releases/latest/download/magicpdf-setup.exe
```

GitHub resolves `latest` to the newest release at request time, so as long as new releases
keep the same asset filenames, this page keeps serving the newest build with no changes here.

## What the JavaScript adds

`assets/js/main.js` is pure progressive enhancement. With JS disabled, blocked, or the GitHub
API rate-limited, every download link still works — the script only adds:

- **Platform detection** — highlights the button matching the visitor's OS, and shows a note
  instead of highlighting anything on Linux, iOS or Android.
- **Live version, date and file size** — read from the GitHub Releases API, so the page never
  hardcodes a version number.
- **Live SHA-256 checksums** — from each asset's `digest` field. Useful because the builds are
  unsigned.
- **Auto-enabling the macOS Magic Video button** — the "Coming soon" placeholder becomes a real
  download link on its own, the moment `magicvideo-macos.dmg` is attached to the latest
  `magicvideo` release. No edit to this repo is needed.
- **A light/dark theme toggle**, remembered in `localStorage`.

The API calls are unauthenticated, which GitHub rate-limits to 60 requests per hour per IP.
That is ample here, and the page degrades silently if the limit is hit.

## Adding a third app

1. Copy one of the two `<article class="card" data-repo="…">` blocks in `index.html`.
2. Set `data-repo` to the new repository name.
3. Point each button's `href` at
   `https://github.com/alaahadyhostinger/<repo>/releases/latest/download/<filename>`
   and set `data-asset` to the same filename.

`main.js` picks the card up automatically — it iterates over `.card[data-repo]`.

## Local preview

```bash
python -m http.server 8765 --directory .
```

Then open <http://localhost:8765>. Use a server rather than opening `index.html` directly, so
the relative asset paths and the API calls behave the same as in production.

## Deployment (Coolify)

The live site runs on the Coolify server that already hosts `amsol.ca`, so
`download.amsol.ca` needs no DNS change — it already points there.

Coolify application settings:

| Field | Value |
|---|---|
| Build Pack | Docker Compose |
| Branch | `main` |
| Base Directory | `/` |
| Docker Compose Location | `/docker-compose.yml` |
| Domain | `https://download.amsol.ca` (port `80`) |

`docker-compose.yml` builds `Dockerfile` into an nginx image holding the static files. Port 80
is `expose`d to Coolify's proxy network rather than published to the host, so there are no port
clashes with the other apps on the server. Coolify writes the proxy labels and handles TLS.

A push to `main` triggers a redeploy if the webhook is enabled.

To check it locally exactly as Coolify runs it:

```bash
docker compose up -d --build
```

`GET /healthz` returns `ok` and backs the container healthcheck.

### GitHub Pages

Pages is also configured on this repo (branch root, with `CNAME`), but it does **not** serve
production — DNS points at the Coolify server. `CNAME` and `.nojekyll` exist only for Pages and
are excluded from the Docker image. Pages can be disabled without affecting the live site.
