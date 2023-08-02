import { TMDBCollectionDetails } from "@types"

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const { id } = event.context.params as {
    id: string
  }

  if (isNaN(Number(id))) return null

  const data: TMDBCollectionDetails = await $fetch(
    `https://api.themoviedb.org/3/collection/${id}?api_key=${config.TMDB_API_KEY}`
  )

  return data
})