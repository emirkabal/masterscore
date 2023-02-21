import { defineStore } from "pinia"
import { generateHeaders } from "../utils/request"
import { IUser } from "~/@types"

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
    isLoading: (state) => state.loading
  },

  actions: {
    async init() {
      if (!process.client) return
      const token = localStorage.getItem("token")
      if (token && !this.token) {
        this.token = token
        await this.getUserData()
      }
    },

    setToken(token: string) {
      this.token = token
      localStorage.setItem("token", token)
    },

    hasToken() {
      return !!this.token
    },

    removeToken() {
      this.token = ""
      localStorage.removeItem("token")
    },

    async login(username: string, password: string) {
      const data = await $fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username,
          password
        })
      })

      if (data.status !== 200 || !data.token) {
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
      this.user = data
      this.loading = false
    }
  }
})
