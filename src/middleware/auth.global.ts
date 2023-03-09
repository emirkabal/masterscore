import { useUserStore } from "~/store/user"

export default defineNuxtRouteMiddleware(() => {
  const userStore = useUserStore()
  userStore.init()
})
