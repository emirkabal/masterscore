import { userInfo } from "os"
import { ErrorResponse, IUser } from "~/@types"
import UserModel from "~/server/models/User.model"
import ActivityModel from "~/server/models/Activity.model"
import grabUserWithoutPassword from "~/utils/grabUserWithoutPassword"
import EntertainmentModel from "~/server/models/Entertainment.model"

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    return { status: 401, message: "Unauthorized" } as ErrorResponse
  }

  const body = await readBody(event)
  const { id, type } = body as {
    id: string
    type: "remove" | "add"
  }
  if (!id || !type)
    return { status: 400, message: "Missing entertainment" } as ErrorResponse

  if ((await EntertainmentModel.findById(id)) === null) {
    return { status: 404, message: "Entertainment not found" } as ErrorResponse
  }

  const user = grabUserWithoutPassword(event.context.user)
  if (
    user.watchlist &&
    user.watchlist.map((e) => e.toString()).includes(id) &&
    type === "remove"
  ) {
    await UserModel.findOneAndUpdate(
      { _id: user._id },
      { $pull: { watchlist: id } }
    )
    await ActivityModel.deleteMany({
      type: "watchlist",
      entertainment: id,
      author: user._id
    })
  } else {
    await UserModel.findOneAndUpdate(
      { _id: user._id },
      { $push: { watchlist: id } }
    )
    await ActivityModel.create({
      type: "watchlist",
      entertainment: id,
      author: user._id
    })
  }

  return { status: 200, message: "Watchlist updated" }
})
