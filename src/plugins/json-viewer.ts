// @ts-ignore
import JsonViewer from "vue-json-viewer"
import "vue-json-viewer/style.css"

export default defineNuxtPlugin((nuxt) => {
  nuxt.vueApp.component("JsonViewer", JsonViewer)
})
