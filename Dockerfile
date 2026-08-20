# Static download page for download.amsol.ca
# Nothing to compile - just nginx serving the files in this repo.
FROM nginx:1.29-alpine

# Replace the default site config with ours.
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/site.conf

# Only the files that make up the site. Repo docs, the GitHub Pages CNAME and
# the Docker files themselves are deliberately not served.
WORKDIR /usr/share/nginx/html
COPY index.html 404.html robots.txt sitemap.xml ./
COPY assets/ ./assets/

# Mount point for uploaded binaries and version.json. Created here so nginx
# still starts (and falls back to GitHub) when nothing is mounted yet.
RUN mkdir -p /srv/downloads

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
