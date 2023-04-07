import {
  ErrorResponse,
  IEntertainment,
  IUser,
  TMDBSearchResult
} from "~/@types"
import EntertainmentModel from "~/server/models/Entertainment.model"
import UserModel from "~/server/models/User.model"
const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    return { status: 401, message: "Unauthorized" } as ErrorResponse
  }

  const user = event.context.user as IUser
  if (!user.likes || user.likes.length === 0) {
    return { status: 400, message: "You have no likes." } as ErrorResponse
  }

  const { likes }: { likes: IEntertainment[] } = await UserModel.findById(
    user._id
  )
    .populate({
      path: "likes",
      model: EntertainmentModel,
      select: "id type info.title -_id"
    })
    .select("likes -_id")
    .lean()

  const releatedEntertainment = likes[Math.floor(Math.random() * likes.length)]

  const data = await $fetch<{
    releated: IEntertainment
    results: TMDBSearchResult[]
  }>(
    `https://api.themoviedb.org/3/${releatedEntertainment.type}/${releatedEntertainment.id}/recommendations?api_key=${config.TMDB_API_KEY}&language=en-US`
  )

  data.releated = releatedEntertainment
  data.results = data.results.filter(
    (result) => result.poster_path && result.backdrop_path
  )
  likes.forEach((like) => {
    data.results = data.results.filter(
      (result) =>
        result.id?.toString() !== like.id.toString() &&
        result.media_type !== like.info.title
    )
  })

  return data
})
