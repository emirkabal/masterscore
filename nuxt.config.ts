// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: "src/",
  ssr: false,
  app: {
    head: {
      title: "Masterscore",
      htmlAttrs: {
        lang: "en"
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" }
      ]
    }
  },

  modules: ["@pinia/nuxt", "@nuxtjs/tailwindcss"],
  css: [
    "@fontsource/maven-pro/400.css",
    "@fontsource/maven-pro/500.css",
    "@fontsource/maven-pro/600.css",
    "@fontsource/maven-pro/700.css",
    "@fontsource/maven-pro/800.css",
    "@fontsource/maven-pro/900.css"
  ],

  experimental: {
    payloadExtraction: false
  },

  runtimeConfig: {
    MONGO_URI: process.env.MONGO_URI,
    TMDB_API_KEY: process.env.TMDB_API_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN
  },

  nitro: {
    plugins: ["~/server/db/index.ts"]
  },

  build: {
    transpile: ["@headlessui/vue", "@headlessui/tailwindcss"]
  }
})
