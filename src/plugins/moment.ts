import moment from "moment"
import momentDurationFormatSetup from "moment-duration-format"
export default defineNuxtPlugin((nuxtApp) => {
  momentDurationFormatSetup(moment)
  return {
    provide: {
      moment
    }
  }
})
