import { useUserStore } from "~/store/user"

export default defineNuxtRouteMiddleware(async () => {
  const userStore = useUserStore()
  await userStore.init()
  if (!userStore.hasToken) {
    return navigateTo("/account/login")
  }
})
