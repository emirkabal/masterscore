import { TMDBSearchResult } from "@types"

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const { type, id } = event.context.params as {
    type: string
    id: string
  }
  if (isNaN(Number(id))) return null
  const data: {
    results: TMDBSearchResult[]
  } = await $fetch(
    `https://api.themoviedb.org/3/${type}/${id}/similar?api_key=${config.TMDB_API_KEY}`
  )

  return data
})
