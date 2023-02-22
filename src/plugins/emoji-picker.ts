// @ts-ignore
import EmojiPicker from "vue3-emoji-picker"

export default defineNuxtPlugin((nuxt) => {
  nuxt.vueApp.component("EmojiPicker", EmojiPicker)
})
