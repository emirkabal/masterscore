import FloatingVue from "floating-vue"
import "floating-vue/dist/style.css"
export default defineNuxtPlugin((nuxt) => {
  nuxt.vueApp.use(FloatingVue)
})
