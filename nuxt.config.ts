// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: "src/",
  ssr: false,

  modules: [
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "@nuxt/content",
    "@vite-pwa/nuxt"
  ],

  css: [
    "vue3-emoji-picker/css",
    "@fontsource/maven-pro/400.css",
    "@fontsource/maven-pro/500.css",
    "@fontsource/maven-pro/600.css",
    "@fontsource/maven-pro/700.css",
    "@fontsource/maven-pro/800.css",
    "@fontsource/maven-pro/900.css"
  ],

  nitro: {
    preset: "vercel",
    plugins: ["~/server/db/index.ts"]
  },

  app: {
    pageTransition: { name: "slide-right", mode: "out-in" },
    head: {
      title: "Masterscore",
      htmlAttrs: {
        lang: "en"
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content:
            "Masterscore is a movie and TV review website with unbiased reviews, recommendations, and ratings on various genres. Find your next favorite show or movie with us!"
        },
        { name: "theme-color", content: "#eab308" }
      ],
      link: [
        {
          rel: "icon",
          type: "image/x-icon",
          href: "/favicon.ico"
        }
      ]
    }
  },

  appConfig: {
    // you don't need to include this: only for testing purposes
    buildDate: new Date().toISOString()
  },

  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "Masterscore",
      short_name: "Masterscore",
      description:
        "Masterscore is a movie and TV review website with unbiased reviews, recommendations, and ratings on various genres. Find your next favorite show or movie with us!",
      theme_color: "#eab308",
      start_url: "/",
      display: "fullscreen",
      icons: [
        {
          src: "pwa-192x192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png"
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable"
        }
      ]
    },
    workbox: {
      navigateFallback: "/",
      globPatterns: ["src/**/*.{js,css,html,png,svg,ico}"]
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 20
    },
    devOptions: {
      enabled: true,
      type: "module"
    }
  },

  experimental: {
    payloadExtraction: false
  },

  runtimeConfig: {
    MONGO_URI: process.env.MONGO_URI,
    TMDB_API_KEY: process.env.TMDB_API_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    INVITE_CODE: process.env.INVITE_CODE
  },

  build: {
    transpile: ["@headlessui/vue", "@headlessui/tailwindcss"]
  }
})
