import moment from "moment"
import "moment/dist/locale/tr"
import "moment/dist/locale/de"
import "moment/dist/locale/es"
import "moment/dist/locale/fr"
import "moment/dist/locale/ru"
import "moment/dist/locale/sv"
import "moment/dist/locale/hi"
import "moment/dist/locale/pt"

import momentDurationFormatSetup from "moment-duration-format"
export default defineNuxtPlugin((nuxtApp) => {
  momentDurationFormatSetup(moment)
  return {
    provide: {
      moment
    }
  }
})
