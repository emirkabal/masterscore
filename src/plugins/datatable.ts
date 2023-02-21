import Vue3EasyDataTable from "vue3-easy-data-table"

export default defineNuxtPlugin((nuxt) => {
  nuxt.vueApp.component("EasyDataTable", Vue3EasyDataTable)
})
