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
    featured: {} as TMDBSearchResult & { logo_path: string },
    now_playing: [] as TMDBSearchResult[],
    watchlist: [] as IEntertainment[],
    recommendations: null as null | {
      releated: IEntertainment
      results: TMDBSearchResult[]
    },
    popular: [] as TMDBSearchResult[],
    trending: [] as TMDBSearchResult[],
    top_rated: [] as TopRatedResult[],
    upcoming: [] as TMDBSearchResult[],
    most_liked: [] as IEntertainment[]
  }

  if (event.context.user) {
    const data = await $fetch("/api/recommendations", {
      headers: {
        authorization: event.node.req.headers.authorization as string
      }
    })
    if ("results" in data) {
      result.recommendations = data
    }
  }

  //@ts-ignore:2321
  const upcoming: { results: TMDBSearchResult[] } = await $fetch(
    `https://api.themoviedb.org/3/movie/upcoming?api_key=${config.TMDB_API_KEY}`
  )

  result.upcoming = upcoming.results

  //@ts-ignore:2321
  const popular: { results: TMDBSearchResult[] } = await $fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${config.TMDB_API_KEY}`
  )

  //@ts-ignore:2321
  const nowPlaying: { results: TMDBSearchResult[] } = await $fetch(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${config.TMDB_API_KEY}`
  )

  result.now_playing = nowPlaying.results

  result.popular = popular.results

  result.top_rated = await $fetch("/api/reviews?limit=20")
  result.trending = await $fetch("/api/extra/trending/movie?time=day")

  //@ts-ignore:2321
  result.featured = await $fetch(
    `https://api.themoviedb.org/3/movie/${result.trending[0].id}?api_key=${config.TMDB_API_KEY}&append_to_response=videos,images`
  )

  //@ts-ignore:2321
  result.featured.logo_path = result.featured.images.logos[0].file_path

  //@ts-ignore:2339
  delete result.featured.images

  //@ts-ignore:2339
  result.featured.video = result.featured.videos.results.find(
    (video: { type: string }) => video.type === "Trailer"
  )

  //@ts-ignore:2339
  delete result.featured.videos

  if (
    event.context.user?.watchlist &&
    event.context.user.watchlist.length > 0
  ) {
    result.watchlist = (
      await UserModel.findById(event.context.user._id)
        .populate({
          path: "watchlist",
          model: EntertainmentModel,
          select: "-_id"
        })
        .select("watchlist -_id")
        .limit(20)
        .lean()
    )?.watchlist as IEntertainment[]
  }

  result.most_liked = await LikeModel.find({
    likes: { $gt: 0 }
  })
    .limit(20)
    .sort({ likes: -1 })
    .populate({
      path: "entertainment",
      model: EntertainmentModel,
      select: "-_id"
    })
    .lean()

  await redis.set(homeId, result, {
    ex: 60 * 60 * 3
  })

  return result
})
