import { ErrorResponse, IEntertainment, IUser } from "~/@types"
import EntertainmentModel from "~/server/models/Entertainment.model"
import UserModel from "~~/src/server/models/User.model"

export default defineEventHandler(async (event) => {
  const { id } = event.context.params as { id: string }
  if (!id) return { status: 400, message: "Missing author" } as ErrorResponse
  const user: IUser = await UserModel.findById(id)
    .populate({
      path: "watchlist",
      model: EntertainmentModel,
      select: "id type info.title info.poster"
    })
    .sort({ createdAt: -1 })
    .lean()

  return user.watchlist as unknown as IEntertainment[]
})
