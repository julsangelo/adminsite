# Base Image
FROM webdevops/php-nginx:8.2-alpine AS base

WORKDIR /var/www/html

ENV WEB_DOCUMENT_ROOT=/var/www/html/public
ENV WEB_DOCUMENT_INDEX=index.php
ENV TZ=Asia/Singapore

# ----------------------------
# Development Stage
FROM base AS development

RUN apk update && apk add --no-cache \
    composer \
    nodejs \
    npm \
    git

COPY . .

# Install backend dependencies
RUN composer install && npm install && npm run build

CMD sh -c '\
    chmod -R 775 storage bootstrap/cache && \
    chown -R application:application storage bootstrap/cache && \
    php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache && \
    php artisan serve --host=0.0.0.0 --port=10000 \
'

# # ----------------------------
# # Production Stage
# FROM base AS production

# # Copy only necessary files from development stage
# COPY --from=development /var/www/html /var/www/html
