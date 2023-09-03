import { IEntertainment, TMDBSearchResult } from "@types"
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
    now_playing: [] as TMDBSearchResult[],
    trending: [] as TMDBSearchResult[],
    upcoming: [] as TMDBSearchResult[]
  }

  // if (event.context.user) {
  //   const data = await $fetch("/api/recommendations", {
  //     headers: {
  //       authorization: event.node.req.headers.authorization as string
  //     }
  //   })
  //   if ("results" in data) {
  //     result.recommendations = data
  //   }
  // }

  //@ts-ignore:2321
  const upcoming: { results: TMDBSearchResult[] } = await $fetch(
    `https://api.themoviedb.org/3/movie/upcoming?api_key=${config.TMDB_API_KEY}`
  )

  result.upcoming = upcoming.results

  //@ts-ignore:2321
  const trending: { results: TMDBSearchResult[] } = await $fetch(
    `https://api.themoviedb.org/3/trending/all/day?api_key=${config.TMDB_API_KEY}`
  )

  result.trending = trending.results

  //@ts-ignore:2321
  const nowPlaying: { results: TMDBSearchResult[] } = await $fetch(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${config.TMDB_API_KEY}`
  )
  //api.themoviedb.org/3/movie/157336?api_key=d6026e393eb5243af3cf84211acd46fe&append_to_response=videos,images
  result.now_playing = nowPlaying.results

  return result
})
