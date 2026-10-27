# Backend Express + TypeScript (compila a dist/ y ejecuta dist/index.js).

FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json tsconfig.json ./
RUN npm ci
COPY src ./src
RUN npm run build

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3700
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
EXPOSE 3700
# Las variables (DB_CNN2, JWT_SECRET) llegan del entorno del contenedor; no se copia .env.
CMD ["node", "dist/index.js"]
