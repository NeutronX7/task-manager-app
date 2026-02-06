FROM node:20-alpine

RUN apk add --no-cache bash git

WORKDIR /app

# Instalar dependencias por caché
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

# lockfile y package manager correcto
RUN if [ -f package-lock.json ]; then npm ci; \
    elif [ -f yarn.lock ]; then corepack enable && yarn install --frozen-lockfile; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm install --frozen-lockfile; \
    else npm install; fi

RUN npm i -g @expo/ngrok@^4.1.0

COPY . .

EXPOSE 8081 19000 19001 19002 19006

# para que expo funcione en docker
ENV EXPO_NO_TELEMETRY=1
ENV REACT_NATIVE_PACKAGER_HOSTNAME=0.0.0.0

# expo en modo lan escuchando en todas las interfaces
CMD ["sh", "-c", "npx expo start --tunnel --port 19000"]
