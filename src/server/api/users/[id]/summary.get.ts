import { Document } from "mongoose"
import { ErrorResponse, IEntertainment, IReview, IUser } from "~/@types"
import UserModel from "~/server/models/User.model"
import ReviewModel from "~/server/models/Review.model"
import EntertainmentModel from "~/server/models/Entertainment.model"
import ActivityModel from "~/server/models/Activity.model"

export default defineEventHandler(async (event) => {
  const { id } = event.context.params as { id: string }
  if (!id) return { status: 400, message: "Missing author" } as ErrorResponse

  const user: Document<IUser> | null = await UserModel.findById(id)
  if (!user) return { status: 404, message: "User not found" } as ErrorResponse

  const featured: IReview[] = await ReviewModel.find({
    author: id
  })
    .populate({
      path: "entertainment",
      model: EntertainmentModel,
      select: "id type info.title info.poster"
    })
    .sort({ rating: -1 })
    .limit(10)
    .lean()

  const reviews = (
    await ActivityModel.find({
      author: id,
      type: "review"
    })
      .select("entertainment createdAt -_id")
      .populate({
        path: "entertainment",
        model: EntertainmentModel,
        select: "id type info.title info.poster"
      })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()
  ).map((e) => e.entertainment) as IEntertainment[]

  const likes = (
    await ActivityModel.find({
      author: id,
      type: "like"
    })
      .select("entertainment createdAt -_id")
      .populate({
        path: "entertainment",
        model: EntertainmentModel,
        select: "id type info.title info.poster"
      })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()
  ).map((e) => e.entertainment) as IEntertainment[]

  const watchlist = (
    await ActivityModel.find({
      author: id,
      type: "watchlist"
    })
      .select("entertainment createdAt -_id")
      .populate({
        path: "entertainment",
        model: EntertainmentModel,
        select: "id type info.title info.poster"
      })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()
  ).map((e) => e.entertainment) as IEntertainment[]

  return {
    featured,
    reviews,
    likes,
    watchlist
  }
})
