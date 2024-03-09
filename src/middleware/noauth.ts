export default defineNuxtRouteMiddleware(async () => {
  if (hasToken()) {
    return navigateTo("/")
  }
})
