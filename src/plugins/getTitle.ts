import { TMDBData } from "../@types"

export default defineNuxtPlugin(() => {
  return {
    provide: {
      getTitle: (data: TMDBData) => {
        return data.title || data.name || "Untitled"
      }
    }
  }
})
