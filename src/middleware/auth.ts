export default defineNuxtRouteMiddleware(async () => {
  if (!hasToken()) {
    return navigateTo("/account/login")
  }
})
