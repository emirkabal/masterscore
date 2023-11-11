import type { IUser } from "~/types"
import { defineStore } from "pinia"
import { generateHeaders } from "../utils/request"
import { useLocalStorage } from "@vueuse/core"

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      user: undefined as Omit<IUser, "password"> | undefined,
      token: "",
      loading: false
    }
  },

  getters: {
    isLoggedIn: (state) => !!state.token,
    isLoading: (state) => state.loading,
    hasToken: (state) => !!state.token
  },

  actions: {
    async init() {
      const token = useLocalStorage("token", null).value
      if (token && !this.token) {
        this.token = token
        await this.getUserData().catch(() => {})
      }
      this.loading = false
    },

    setToken(token: string) {
      this.token = token
      useLocalStorage("token", token)
    },

    removeToken() {
      this.token = ""
      useLocalStorage("token", null).value = null
    },

    async login(username: string, password: string) {
      const data = await $fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username,
          password
        })
      })

      if (!("token" in data)) {
        return data
      }

      this.setToken(data.token)
      await this.getUserData()
      return data
    },

    async logout() {
      this.loading = true
      this.removeToken()
      this.user = undefined
      this.loading = false
      useRouter().push("/")
    },

    async getUserData() {
      this.loading = true
      const data = await $fetch("/api/users/me", {
        headers: generateHeaders()
      })
      if ("status" in data) {
        this.removeToken()
        this.loading = false
        return
      }
      this.user = data as unknown as Omit<IUser, "password">
      this.loading = false
    }
  }
})
