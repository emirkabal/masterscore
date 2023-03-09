import { hasToken } from "../utils/request"

export default defineNuxtRouteMiddleware(async () => {
  if (hasToken()) {
    return navigateTo("/")
  }
})
