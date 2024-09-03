import moment from "moment/min/moment-with-locales"
import humanize from "humanize-duration"

declare module "#app" {
  interface NuxtApp {
    $moment: typeof moment
    $humanize: typeof humanize
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      moment,
      humanize
    }
  }
})
