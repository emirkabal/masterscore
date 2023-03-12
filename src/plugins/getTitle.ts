import { TMDBData } from "../@types"

export default defineNuxtPlugin(() => {
  return {
    provide: {
      getTitle: (data: TMDBData) => {
        return data.original_name && data.original_name.match(/[a-z]/i)
          ? data.original_name
          : data.original_title && data.original_title.match(/[a-z]/i)
          ? data.original_title
          : data.title || data.name || "Untitled"
      }
    }
  }
})
