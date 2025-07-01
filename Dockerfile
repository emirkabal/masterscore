FROM node:22-alpine AS builder
ENV NODE_OPTIONS=--max-old-space-size=4096

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app


COPY package.json pnpm-lock.yaml ./


RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .

RUN pnpm postinstall
RUN pnpm build


FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]