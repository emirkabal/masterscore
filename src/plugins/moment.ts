import moment from "moment"
import "moment/dist/locale/tr"
import "moment/dist/locale/de"
import momentDurationFormatSetup from "moment-duration-format"
export default defineNuxtPlugin((nuxtApp) => {
  momentDurationFormatSetup(moment)
  return {
    provide: {
      moment
    }
  }
})
