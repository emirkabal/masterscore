const config = useRuntimeConfig()
export default defineEventHandler(async (event) => {
  const { id } = event.context.params as {
    id: string
  }
  const { type } = getQuery(event) as {
    type: string
  }

  const data = await $fetch(
    `https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${config.TMDB_API_KEY}`
  )

  return data
})
