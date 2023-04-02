// @ts-ignore
import StarRating from "vue-star-rating"

export default defineNuxtPlugin((nuxt) => {
  nuxt.vueApp.component("StarRating", StarRating)
})
