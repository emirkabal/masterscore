import moment from "moment"
import humanize from "humanize-duration"
import "moment/locale/tr"
import "moment/locale/de"
import "moment/locale/es"
import "moment/locale/fr"
import "moment/locale/ru"
import "moment/locale/sv"
import "moment/locale/hi"
import "moment/locale/pt"
import "moment/locale/ja"
import "moment/locale/da"
import "moment/locale/ko"
import "moment/locale/uk"
import "moment/locale/ar"

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      moment,
      humanize
    }
  }
})
