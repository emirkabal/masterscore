import type { User } from "~/types"
import { defineStore } from "pinia"
import { generateHeaders } from "~/composables/user"

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      user: undefined as Omit<User, "password"> | undefined,
      token: "" as string | null,
      loading: true
    }
  },

  hydrate: (state) => {
    const token = localStorage.getItem("token")
    if (!token) {
      state.loading = false
    }
    state.token = token
  },

  getters: {
    isMe: (state) => (id: string) => state.user?.id === id,
    isLoggedIn: (state) => !!state.token,
    isLoading: (state) => !!state.loading,

    isLiked: (state) => (mediaId: string) => {
      return state.user?.likes.includes(mediaId)
    },
    isReviewed: (state) => (mediaId: string) => {
      return state.user?.reviews.includes(mediaId)
    },
    isAddedToAnyCollection: (state) => (mediaId: string) => {
      return state.user?.collections.some((collection) => collection.list.includes(mediaId))
    },
    isAddedToCollection: (state) => (mediaId: string, collectionId: string) => {
      const collection = state.user?.collections.find(
        (collection) => collection.id === collectionId
      )
      return collection?.list.includes(mediaId)
    }
  },

  actions: {
    async init() {
      this.token = localStorage.getItem("token") || null
      if (import.meta.client && this.token) await this.getUserData().catch(() => {})
      this.loading = false
    },

    setToken(token: string) {
      this.token = token
      localStorage.setItem("token", token)
    },

    removeToken() {
      this.token = ""
      localStorage.removeItem("token")
    },

    async login(username: string, password: string) {
      const data = await $fetch("/api/account/login", {
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
      try {
        const data = await $fetch("/api/users/me", {
          headers: generateHeaders()
        })

        this.user = data as unknown as Omit<User, "password">
      } catch (e: any) {
        if (e.statusCode === 403) {
          localStorage.setItem("suspended", "1")
          this.removeToken()
          return
        }
        if (e?.statusCode === 401 && this.token) this.removeToken()
      } finally {
        this.loading = false
      }
    },

    async waitForUser() {
      if (import.meta.server) return Promise.resolve(false)
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          if (!this.token) {
            clearInterval(interval)
            resolve(false)
          } else if (this.user) {
            clearInterval(interval)
            resolve(true)
          }
        }, 100)
        setTimeout(() => {
          clearInterval(interval)
          resolve(false)
        }, 5000)
      })
    }
  }
})
