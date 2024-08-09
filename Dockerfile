FROM node:20-alpine

WORKDIR /app

RUN apk --no-cache add openssh openssl
RUN npm i -g pnpm

COPY . /app/

RUN pnpm install && pnpm postinstall

RUN pnpm run build

EXPOSE 3000

ENTRYPOINT ["node", ".output/server/index.mjs"]