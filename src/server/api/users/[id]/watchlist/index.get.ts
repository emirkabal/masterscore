import type { IEntertainment, IUser } from "~/types"
import UserModel from "~/server/models/User.model"
import EntertainmentModel from "~/server/models/Entertainment.model"
import ActivityModel from "~/server/models/Activity.model"

export default defineEventHandler(async (event) => {
  const { id } = event.context.params as { id: string }
  if (!id)
    return createError({
      statusCode: 400,
      message: "Missing id field"
    })

  const user: IUser | null = await UserModel.findById(id).lean()
  if (!user)
    return createError({
      statusCode: 404,
      message: "User not found"
    })

  const watchlist = (
    await ActivityModel.find({
      author: id,
      type: "watchlist"
    })
      .select("entertainment createdAt -_id")
      .populate({
        path: "entertainment",
        model: EntertainmentModel,
        select: "id type info.title info.poster info.release_date"
      })
      .sort({ createdAt: -1 })
      .lean()
  ).map((e) => e.entertainment) as IEntertainment[]

  return watchlist
})
