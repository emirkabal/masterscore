FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_OPTIONS=--max-old-space-size=4096

RUN npm install -g pnpm@9
RUN apk --no-cache add g++ make python3

COPY . /app
WORKDIR /app


FROM base AS install

RUN pnpm install --frozen-lockfile
RUN pnpm run build

FROM base AS runner

COPY --from=install /app/package.json ./
COPY --from=install /app/.output ./.output

EXPOSE 3000
ENTRYPOINT ["node", ".output/server/index.mjs"]