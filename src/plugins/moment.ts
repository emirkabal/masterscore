import moment from "moment"
import "moment/dist/locale/tr"
import "moment/dist/locale/de"
import "moment/dist/locale/es"
import "moment/dist/locale/fr"
import "moment/dist/locale/ru"
import "moment/dist/locale/sv"
import "moment/dist/locale/hi"
import "moment/dist/locale/pt"
import "moment/dist/locale/ja"
import "moment/dist/locale/da"
import "moment/dist/locale/ko"
import "moment/dist/locale/uk"
import "moment/dist/locale/ar"

import momentDurationFormatSetup from "moment-duration-format"
export default defineNuxtPlugin((nuxtApp) => {
  // @ts-ignore
  momentDurationFormatSetup(moment)
  return {
    provide: {
      moment
    }
  }
})
