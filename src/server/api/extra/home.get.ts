import { IEntertainment, TMDBSearchResult } from "~/@types"
import getISO from "~/utils/getISO"

const config = useRuntimeConfig()

interface TopRatedResult {
  average: number
  entertainment: IEntertainment
  reviewsCount: number
}

export default defineEventHandler(async (event) => {
  const lang = getISO(getCookie(event, "locale"))
  const result = {
    recommendations: [] as TMDBSearchResult[],
    trending: [] as TMDBSearchResult[],
    top_rated: [] as TopRatedResult[]
  }

  if (event.context.user) {
    const data = await $fetch("/api/recommendations", {
      headers: {
        authorization: event.node.req.headers.authorization as string
      }
    })
    if ("results" in data) {
      result.recommendations = data.results
    }
  } else {
    //@ts-ignore:2321
    const popular: { results: TMDBSearchResult[] } = await $fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${config.TMDB_API_KEY}&include_adult=false&page=1&sort_by=popularity.desc`
    )
    result.recommendations = popular.results
  }

  //@ts-ignore:2321
  const trending: { results: TMDBSearchResult[] } = await $fetch(
    `https://api.themoviedb.org/3/trending/all/week?api_key=${config.TMDB_API_KEY}&language=${lang}`
  )

  result.trending = trending.results
  result.top_rated = await $fetch("/api/reviews?limit=20")

  return result
})
