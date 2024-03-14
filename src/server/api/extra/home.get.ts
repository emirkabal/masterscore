import getISO from "~/utils/getISO"

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const lang = getISO(getCookie(event, "locale"))
  const result = {
    trending: [] as any,
    top_rated: [] as any
  }

  //@ts-ignore:2321
  const trending: { results: TMDBSearchResult[] } = await $fetch(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=${config.TMDB_API_KEY}&language=${lang}`
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
    .sort((a, b) => {
      const aScore = a.score ?? a.vote_average
      const bScore = b.score ?? b.vote_average
      return bScore - aScore
    })
  result.top_rated = await $fetch("/api/reviews?limit=20")

  return result
})
