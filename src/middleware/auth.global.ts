import { useUserStore } from "~~/store/user"

export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore()
  await userStore.init()
})
