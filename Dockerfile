FROM node:20-alpine

WORKDIR /app

RUN apk --no-cache add openssh openssl

COPY . /app/

RUN npm install -g pnpm

RUN pnpm install
RUN pnpm postinstall
RUN pnpm run build

EXPOSE 3000

ENTRYPOINT ["node", ".output/server/index.mjs"]