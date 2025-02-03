FROM oven/bun:latest as builder

WORKDIR /app

COPY package.json bun.lockb ./
COPY nuxt.config.ts ./nuxt.config.ts
RUN bun install --frozen-lockfile
COPY . .

RUN bun run build

FROM node:20-slim as runner

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lockb ./
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/nuxt.config.ts ./nuxt.config.ts

EXPOSE 3000
ENTRYPOINT ["node", ".output/server/index.mjs"]