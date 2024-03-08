export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("vue:error", (err) => {
    console.log(err)
    console.log("AAAAAAAAAAAAAAAAAAA")
  })
})
