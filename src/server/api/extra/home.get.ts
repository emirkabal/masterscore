import {
  getMostLikedUsers,
  getMostReviewedUsers,
  getTopMediaByLikes,
  getTopMediaByReviews,
  getTopMediaByReviewsContent
} from "~/server/utils"
import type { TMDBSearchResultsResponse } from "~/types"
import getISO from "~/utils/getISO"

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const lang = getISO(getCookie(event, "locale"))
  const result = {
    trending: [] as any,
    top_rated: [] as any,
    top_commented: [] as any,
    top_liked: [] as any,
    users_most_commented: [] as any,
    users_most_reviewed: [] as any,
    users_most_liked: [] as any
  }

  const trending = await $fetch<TMDBSearchResultsResponse>(
    `https://api.themoviedb.org/3/trending/all/week?api_key=${config.TMDB_API_KEY}&language=${lang}`
  )

  const scores = await $fetch(
    `/api/reviews/pick/${trending.results.map((r) => r.id).join(",")}?type=movie`
  )
  result.trending = trending.results.map((media) => {
    const rating = scores.find((s) => s.tmdb_id === media.id)
    return {
      ...media,
      score: rating?.score
    }
  })
  // .sort((a, b) => {
  //   const aScore = a.score ?? a.vote_average ?? 0
  //   const bScore = b.score ?? b.vote_average ?? 0
  //   return bScore - aScore
  // })

  result.top_rated = await getTopMediaByReviews({ limit: 20 })
  result.top_liked = await getTopMediaByLikes()
  result.top_commented = await getTopMediaByReviewsContent()

  result.users_most_commented = await getMostReviewedUsers({ comment: true })
  result.users_most_reviewed = await getMostReviewedUsers({ comment: false })

  result.users_most_liked = await getMostLikedUsers()

  return result
})
