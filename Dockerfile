# Static download page for download.amsol.ca
FROM nginx:1.29-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/site.conf

WORKDIR /usr/share/nginx/html
COPY index.html 404.html robots.txt sitemap.xml version.json ./
COPY assets/ ./assets/
COPY *.zip ./

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz | grep -q ok || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
