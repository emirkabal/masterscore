import { TMDBSearchResult } from "~/@types"
import getISO from "~/utils/getISO"

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const { type } = event.context.params as {
    type: string
  }
  const { with_genres, without_genres, with_keywords, without_keywords } =
    getQuery(event) as {
      with_genres: string
      without_genres: string
      with_keywords: string
      without_keywords: string
    }

  const language = getISO(getCookie(event, "locale"))
  const params = new URLSearchParams({
    api_key: config.TMDB_API_KEY,
    language,
    page: "1",
    include_adult: "false",
    include_video: "false",
    sort_by: "popularity.desc",
    with_genres,
    without_genres,
    with_keywords,
    without_keywords
  })

  const data: {
    results: TMDBSearchResult[]
    total_pages: number
    total_results: number
    page: number
  } = await $fetch(
    `https://api.themoviedb.org/3/discover/${type}?${params.toString()}`
  )

  return data
})
