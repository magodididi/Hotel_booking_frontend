# Этап сборки приложения
FROM --platform=$BUILDPLATFORM node:23-alpine AS app-build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Этап запуска с Caddy
FROM caddy:2

# Копируем статические файлы из предыдущего этапа
COPY --from=app-build /app/build /srv

# Копируем Caddyfile в нужное место
COPY Caddyfile /etc/caddy/Caddyfile
