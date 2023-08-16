import { ErrorResponse, IEntertainment, IUser } from "~/@types"
import EntertainmentModel from "~/server/models/Entertainment.model"
import UserModel from "~/server/models/User.model"

export default defineEventHandler(async (event) => {
  const { id } = event.context.params as { id: string }
  if (!id) return { status: 400, message: "Missing author" } as ErrorResponse
  const user: IUser | null = await UserModel.findById(id)
    .populate({
      path: "watchlist",
      model: EntertainmentModel,
      select:
        "id type info.title info.poster info.release_date info.description",
      options: {
        sort: {
          createdAt: -1
        }
      }
    })
    .lean()

  if (!user) return { status: 404, message: "User not found" } as ErrorResponse
  return user.watchlist as unknown as IEntertainment[]
})
