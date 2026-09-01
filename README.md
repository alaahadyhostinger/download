# download.amsol.ca — Advanced Management Solutions Public Download Portal

A collection of free, secure Windows tools for productivity and media management, served live via Coolify and Caddy at [https://download.amsol.ca](https://download.amsol.ca).

> **Security & Code Signing:** This project uses [SignPath Foundation](https://signpath.org/) for secure code signing.

## Featured Applications

| Application | Version | OS | Download | SHA-256 Checksum |
| :--- | :--- | :--- | :--- | :--- |
| **Magic-Watch** | **v1.2.0** | Windows 10/11 (64-bit) | [`magicwatch-latest.zip`](https://download.amsol.ca/magicwatch-latest.zip) | `7e210c55d9a25c87f25840b421e38afba386ea751484217c3f73428e2cb17bb1` |
| **MagicMidi** | **v1.2.0** | Windows 10/11 (64-bit) | [`magicmidi-latest.zip`](https://download.amsol.ca/magicmidi-latest.zip) | `d48c6245df78c840a85b84eb2b891f2ef8e79f885082e4c84d350556ed3ce58b` |
| **Magic Video** | v1.2.0 | Windows 10/11 (64-bit) | [`magicvideo-portable.zip`](https://github.com/alaahadyhostinger/magicvideo/releases/latest) | `3e6605b766ecad7f311c1d0bfa81024a1b02ea91bc0c8bc46fae859b85c13bcf` |
| **Magic PDF** | v1.0.0 | Windows 10/11 (64-bit) | [`magicpdf-latest.zip`](https://download.amsol.ca/magicpdf-latest.zip) | `60a4f5c22ee3a6509f6b92a2a07c3905cfc2c9ee5349e5d4a1329c314da17e0a` |

## Repository Architecture

```
.
├── index.html            # Public download landing page with dark/light themes & OS detection
├── privacy.html          # Comprehensive Privacy Policy & open-source declaration
├── 404.html              # Custom branded 404 error page
├── docker-compose.yml    # Coolify production deployment specification
├── Dockerfile            # Nginx 1.29-alpine serving static assets & zip bundles
├── nginx.conf            # High-performance routing, compression, security headers, /healthz
├── version.json          # Multi-product structured version and release registry
├── robots.txt            # Search engine crawl directives
├── sitemap.xml           # Search engine sitemap
├── assets/
│   ├── css/style.css     # AMS corporate theme, policy typography & responsive grid styling
│   ├── js/main.js        # Progressive enhancement (OS detection, theme toggling, release hydration)
│   └── img/              # Logos and application icons (MagicPDF, MagicVideo, MagicWatch, MagicMidi)
├── magicwatch-latest.zip # Standalone portable distribution package for Magic-Watch v1.2.0
└── magicmidi-latest.zip  # Standalone portable distribution package for MagicMidi v1.2.0
```

## Coolify & Caddy Server Deployment

This repository is connected directly to Coolify:
- **Build Pack**: Docker Compose (`/docker-compose.yml`)
- **Domain**: `https://download.amsol.ca`
- **Port**: Exposed on port 80 to Coolify proxy network (Caddy handles TLS certificates).
- **Auto-Deployment**: Pushing to the `main` branch automatically triggers a container rebuild and redeploys the latest website and binaries.

## Verification

To verify download integrity in PowerShell:
```powershell
Get-FileHash .\magicwatch-latest.zip -Algorithm SHA256
Get-FileHash .\magicmidi-latest.zip -Algorithm SHA256
```

---
Official Publisher: **Advanced Management Solutions (AMSOL)**  
Privacy Policy: [https://download.amsol.ca/privacy.html](https://download.amsol.ca/privacy.html)  
Corporate Site: [https://amsol.ca](https://amsol.ca)
