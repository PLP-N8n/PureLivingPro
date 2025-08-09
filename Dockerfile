# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# Install deps first (leverage Docker layer cache)
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

# Reinstall dev deps for build stage separately (since vite/esbuild are dev deps)
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy full source and build
COPY . .
RUN npm run build

# Runtime image
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Copy only what is needed to run
COPY --from=build /app/package.json /app/package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

COPY --from=build /app/dist ./dist
COPY --from=build /app/dist/public ./dist/public

EXPOSE 5000
CMD ["node", "dist/index.js"]
