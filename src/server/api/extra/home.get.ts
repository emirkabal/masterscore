import { IEntertainment, TMDBSearchResult } from "~/@types"
import redis from "~/utils/redis"
import EntertainmentModel from "~/server/models/Entertainment.model"
import UserModel from "~/server/models/User.model"
import LikeModel from "~/server/models/Like.model"

const config = useRuntimeConfig()

interface TopRatedResult {
  average: number
  entertainment: IEntertainment
  reviewsCount: number
}

export default defineEventHandler(async (event) => {
  const homeId = `home-${event.context.user?._id || "guest"}`
  const cached = await redis.get(homeId)
  if (cached) return cached

  const result = {
    recommendations: [] as TMDBSearchResult[],
    trending: [] as TMDBSearchResult[]
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
      `https://api.themoviedb.org/3/discover/movie?include_adult=false&language=en-US&page=1&sort_by=popularity.desc&api_key=${config.TMDB_API_KEY}`
    )
    result.recommendations = popular.results
  }

  //@ts-ignore:2321
  const trending: { results: TMDBSearchResult[] } = await $fetch(
    `https://api.themoviedb.org/3/trending/all/week?api_key=${config.TMDB_API_KEY}`
  )

  result.trending = trending.results

  //@ts-ignore:2321

  return result
})
