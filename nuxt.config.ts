// https://nuxt.com/docs/api/configuration/nuxt-config
import icons from "./config/icons"
import i18n from "./config/modules/i18n"

export default defineNuxtConfig({
  srcDir: "src/",
  ssr: false,
  devtools: {
    enabled: false
  },
  modules: [
    ["@nuxtjs/i18n", i18n],
    "@nuxt/image-edge",
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/device",
    "@vite-pwa/nuxt",
    "nuxt-twemoji"
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

  routeRules: {
    "/**": {
      isr: true
    },
    "/api/**": {
      cors: true,
      isr: false
    }
  },

  nitro: {
    plugins: ["~/server/db/index.ts"]
  },

  app: {
    // pageTransition: { name: "slide" },
    head: {
      title: "Masterscore",
      htmlAttrs: {
        lang: "en"
      },
      meta: [
        { charset: "utf-8" },
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
        },
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
    buildDate: new Date().toISOString()
  },
  pwa: {
    registerType: "autoUpdate",
    srcDir: "src/",
    manifest: {
      name: "Masterscore",
      short_name: "Masterscore",
      description:
        "Masterscore is a movie and TV review website with unbiased reviews, recommendations, and ratings on various genres. Find your next favorite show or movie with us!",
      theme_color: "#eab308",
      background_color: "#ffffff",
      start_url: "/",
      display: "fullscreen",
      icons
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 20
    },
    workbox: {
      navigateFallback: null,
      globDirectory: ".vercel/output",
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
      globIgnores: ["**/node_modules/**"],
      runtimeCaching: [
        {
          urlPattern: "/api/.*",
          handler: "NetworkFirst",
          method: "GET",
          options: {
            cacheName: "api-cache",
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 7
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ]
    }
  },

  tailwindcss: {
    viewer: false
  },

  runtimeConfig: {
    MONGO_URI: process.env.MONGO_URI,
    TMDB_API_KEY: process.env.TMDB_API_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_KEY: process.env.SUPABASE_KEY,
    INVITE_CODE: process.env.INVITE_CODE,
    public: {
      SUPABASE_STORAGE_URL: process.env.SUPABASE_STORAGE_URL
    }
  },

  build: {
    transpile: ["@headlessui/vue", "@headlessui/tailwindcss"]
  }
})
