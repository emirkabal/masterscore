import moment from "moment/min/moment-with-locales"
import humanize from "humanize-duration"
export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      moment,
      humanize
    }
  }
})
