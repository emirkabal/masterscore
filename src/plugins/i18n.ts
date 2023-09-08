export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("vue:setup", () => {
    const { locale, setLocaleCookie, getLocaleCookie } = useI18n()
    const cookie = getLocaleCookie()
    if (!cookie) {
      setLocaleCookie(locale.value)
    }
  })
})
