import moment from "moment"
import "moment/dist/locale/tr"
import "moment/dist/locale/de"
import momentDurationFormatSetup from "moment-duration-format"
export default defineNuxtPlugin((nuxtApp) => {
  momentDurationFormatSetup(moment)
  nuxtApp.hook("vue:setup", () => {
    const { locale } = useI18n()
    moment.locale(locale.value)
  })
  nuxtApp.hook("i18n:localeSwitched", ({ newLocale }) => {
    moment.locale(newLocale)
  })
  return {
    provide: {
      moment
    }
  }
})
