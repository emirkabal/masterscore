import type { TMDBWatchProvider } from "~/types"

const config = useRuntimeConfig()
export default defineEventHandler(async (event) => {
  const { id } = event.context.params as {
    id: string
  }
  const { type } = getQuery(event) as {
    type: string
  }

  let data: any = await $fetch(
    `https://api.themoviedb.org/3/${type}/${id}/watch/providers?api_key=${config.TMDB_API_KEY}`
  )

  data = {
    id: data.id,
    results: {
      TR: {
        ...data.results.TR
      }
    }
  }

  return data as TMDBWatchProvider
})
