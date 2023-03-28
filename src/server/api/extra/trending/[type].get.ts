import { TMDBMovie, TMDBTV } from "~/@types"

const config = useRuntimeConfig()
export default defineEventHandler(async (event) => {
  const { type } = event.context.params as {
    type: string
  }
  const { time } = getQuery(event) as {
    time: string | undefined
  }
  const data: { results: TMDBMovie[] | TMDBTV[] } = await $fetch(
    `https://api.themoviedb.org/3/trending/${type}/${
      time ? time : "week"
    }?api_key=${config.TMDB_API_KEY}&page=1`
  )

  return data.results ? data.results : []
})
