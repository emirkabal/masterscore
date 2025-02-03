FROM oven/bun:latest as builder

WORKDIR /app

COPY . ./
RUN bun install --frozen-lockfile

RUN bun run build

FROM node:20-slim as runner

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/.output ./.output


EXPOSE 3000
ENTRYPOINT ["node", ".output/server/index.mjs"]