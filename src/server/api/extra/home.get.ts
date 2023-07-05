import { IEntertainment, TMDBSearchResult } from "@types"
import EntertainmentModel from "~/server/models/Entertainment.model"
import UserModel from "~/server/models/User.model"

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const result = {
    featured: {} as TMDBSearchResult,
    now_playing: [] as TMDBSearchResult[],
    watchlist: [] as IEntertainment[],
    recommendations: null as null | {
      releated: IEntertainment
      results: TMDBSearchResult[]
    },
    popular: [] as TMDBSearchResult[],
    trending: [] as TMDBSearchResult[],
    top_rated: [] as {
      average: number
      entertainment: IEntertainment
      reviewsCount: number
    }[],
    upcoming: [] as TMDBSearchResult[]
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
  result.trending = await $fetch("/api/extra/trending/all")

  result.featured = result.recommendations?.results
    ? result.recommendations.results[0]
    : result.popular[0]

  if (
    event.context.user?.watchlist &&
    event.context.user.watchlist.length > 0
  ) {
    result.watchlist = (
      await UserModel.findById(event.context.user._id)
        .populate({
          path: "watchlist",
          model: EntertainmentModel,
          select: "id type info.title -_id"
        })
        .select("watchlist -_id")
        .limit(20)
        .lean()
    )?.watchlist as IEntertainment[]
  }

  return result
})
