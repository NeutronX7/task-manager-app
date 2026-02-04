FROM php:8.3-cli

# System dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libicu-dev \
 && docker-php-ext-install \
    pdo_mysql \
    mbstring \
    zip \
    intl \
 && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# working dir
WORKDIR /var/www/html

# port
EXPOSE 8000

# default
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
