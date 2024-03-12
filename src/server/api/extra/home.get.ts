import type { TMDBResult, TMDBSearchResults } from "~/types"
import getISO from "~/utils/getISO"

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const lang = getISO(getCookie(event, "locale"))
  const result = {
    recommendations: [] as any,
    trending: [] as any,
    top_rated: [] as any
  }

  const popular = await $fetch<TMDBSearchResults<TMDBResult>>(
    `https://api.themoviedb.org/3/discover/movie?api_key=${config.TMDB_API_KEY}&include_adult=false&page=1&sort_by=popularity.desc`
  )
  result.recommendations = popular.results

  //@ts-ignore:2321
  const trending: { results: TMDBSearchResult[] } = await $fetch(
    `https://api.themoviedb.org/3/trending/movie/day?api_key=${config.TMDB_API_KEY}&language=${lang}`
  )

  const scores = await $fetch(
    `/api/reviews/pick/${trending.results.map((r) => r.id).join(",")}?type=movie`
  )
  result.trending = trending.results
    .map((media) => {
      const rating = scores.find((s) => s.tmdb_id === media.id)
      return {
        ...media,
        score: rating?.score
      }
    })
    .slice(0, 10)
    .sort((a, b) => {
      const aScore = a.score ?? 0
      const bScore = b.score ?? 0
      return bScore - aScore
    })
  result.top_rated = await $fetch("/api/reviews?limit=20")

  return result
})
