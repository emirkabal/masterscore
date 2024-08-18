export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("i18n:localeSwitched", ({ newLocale }) => {
    nuxtApp.vueApp.$nuxt.$event("refresh:entertainment")
    if (import.meta.client) {
      window.scrollTo(0, 0)
    }
  })
  nuxtApp.hook("vue:setup", () => {
    const { locale, setLocaleCookie, getLocaleCookie } = useI18n()
    const cookie = getLocaleCookie()
    if (!cookie) {
      setLocaleCookie(locale.value)
    }
  })
})
