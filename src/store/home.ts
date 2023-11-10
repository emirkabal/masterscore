import type { IHomeResponse, IUser } from "~/types"
import { defineStore } from "pinia"

export const useHomeStore = defineStore("home", {
  state: () => {
    return {
      recommendations: [],
      trending: [],
      top_rated: []
    } as IHomeResponse
  },

  getters: {
    isStored: (state) => state.recommendations.length > 0
  },

  actions: {
    setData(data: IHomeResponse) {
      this.recommendations = data.recommendations
      this.trending = data.trending
      this.top_rated = data.top_rated
    }
  }
})
