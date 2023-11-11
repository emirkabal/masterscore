import vue3starRatings from "vue3-star-ratings"

export default defineNuxtPlugin((nuxt) => {
  nuxt.vueApp.component("StarRating", vue3starRatings)
})
