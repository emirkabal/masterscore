// https://nuxt.com/docs/api/configuration/nuxt-config
import icons from "./config/icons"
import i18n from "./config/modules/i18n"
import { version } from "./package.json"

const isDev = process.env.NODE_ENV === "development"
export default defineNuxtConfig({
  srcDir: "src/",
  ssr: true,
  spaLoadingTemplate: "./app/spa-loading-template.html",
  devtools: {
    enabled: true
  },
  modules: [
    ["@nuxtjs/i18n", i18n],
    "@nuxt/image",
    "@pinia/nuxt",
    [
      "shadcn-nuxt",
      {
        componentDir: "src/components/ui"
      }
    ],
    "nuxt-headlessui",

    [
      "@nuxtjs/device",
      {
        refreshOnResize: true
      }
    ],
    "@vite-pwa/nuxt",
    "nuxt-icon"
  ],

  css: [
    "~/assets/css/main.css",
    "vue3-emoji-picker/css",
    "@fontsource/inter/400.css",
    "@fontsource/inter/600.css",
    "@fontsource/inter/800.css",
    "@fontsource/maven-pro/600.css",
    "@fontsource/maven-pro/700.css",
    "@fontsource/maven-pro/900.css"
  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
      ...(isDev ? {} : { cssnano: {} })
    }
  },

  routeRules: {
    "/**": isDev ? {} : { cache: { swr: true, maxAge: 120, staleMaxAge: 60, headersOnly: true } },
    "/account/**": { ssr: false },
    "/settings": { ssr: false }
  },

  nitro: {
    routeRules: {
      "/**": { isr: false }
    }
  },

  app: {
    head: {
      title: "Masterscore",
      htmlAttrs: {
        lang: "en"
      },
      meta: [
        { charset: "utf-8" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        },
        {
          // @ts-ignore
          viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
          mobileAppIOS: true
        },
        { name: "mobile-web-app-capable", content: "yes" },
        { name: "full-screen", content: "yes" },
        { name: "browsermode", content: "application" },
        { name: "screen-orientation", content: "portrait" },
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
    buildDate: new Date().toISOString(),
    version
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
    }
    // workbox: {
    //   navigateFallback: null,
    //   globDirectory: ".vercel/output",
    //   globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
    //   globIgnores: ["**/node_modules/**"],
    //   runtimeCaching: [
    //     {
    //       urlPattern: "/api/.*",
    //       handler: "NetworkFirst",
    //       method: "GET",
    //       options: {
    //         cacheName: "api-cache",
    //         expiration: {
    //           maxEntries: 100,
    //           maxAgeSeconds: 60 * 60 * 24 * 7
    //         },
    //         cacheableResponse: {
    //           statuses: [0, 200]
    //         }
    //       }
    //     }
    //   ]
    // }
  },

  runtimeConfig: {
    MONGO_URI: process.env.MONGO_URI,
    TMDB_API_KEY: process.env.TMDB_API_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_KEY: process.env.SUPABASE_KEY,
    INVITE_CODE: process.env.INVITE_CODE,
    JWT_SECRET: process.env.JWT_SECRET,
    VERSION: version,
    public: {
      SOCKET_SERVER: process.env.SOCKET_SERVER,
      SUPABASE_STORAGE_URL: process.env.SUPABASE_STORAGE_URL,
      TMDB_API_TOKEN: process.env.TMDB_API_TOKEN
    }
  }
})
