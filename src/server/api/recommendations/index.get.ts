import type { ErrorResponse, IEntertainment, IUser, TMDBSearchResult } from "~/types"
import EntertainmentModel from "~/server/models/Entertainment.model"
import UserModel from "~/server/models/User.model"
import getISO from "~/utils/getISO"
const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    return { status: 401, message: "Unauthorized" } as ErrorResponse
  }

  const user = event.context.user as IUser
  if (!user.likes || user.likes.length === 0) {
    return { status: 400, message: "You have no likes." } as ErrorResponse
  }

  // @ts-ignore:2322
  const { likes, reviews }: { likes: IEntertainment[]; reviews: IEntertainment[] } =
    await UserModel.findById(user._id)
      .populate({
        path: "likes",
        model: EntertainmentModel,
        select: "id type info.title -_id"
      })
      .populate({
        path: "reviews",
        model: EntertainmentModel,
        select: "id type info.title -_id"
      })
      .select("likes reviews -_id")
      .lean()

  const releatedEntertainment = likes[Math.floor(Math.random() * likes.length)]

  const lang = getISO(getCookie(event, "locale"))
  const data = await $fetch<{
    releated: IEntertainment
    results: TMDBSearchResult[]
  }>(
    `https://api.themoviedb.org/3/${releatedEntertainment.type}/${releatedEntertainment.id}/recommendations?api_key=${config.TMDB_API_KEY}&language=${lang}`
  )

  data.releated = releatedEntertainment
  data.results = data.results.filter((result) => result.poster_path && result.backdrop_path)
  likes.forEach((like) => {
    data.results = data.results.filter(
      (result) => !(result.id?.toString() === like.id.toString() && result.media_type === like.type)
    )
  })

  reviews.forEach((review) => {
    data.results = data.results.filter(
      (result) =>
        !(result.id?.toString() === review.id.toString() && result.media_type === review.type)
    )
  })

  return data as {
    releated: IEntertainment
    results: TMDBSearchResult[]
  }
})
