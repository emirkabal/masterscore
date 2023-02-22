import { ErrorResponse, IUser } from "~/@types"
import UserModel from "~/server/models/User.model"

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id as string
  if (!id) {
    return { status: 400, message: "Missing id" } as ErrorResponse
  }

  const user: Partial<IUser> = await UserModel.findOne({
    username: id
  }).lean()

  if (!user) {
    return { status: 404, message: "User not found" } as ErrorResponse
  }

  if (!user.about) user.about = null
  if (!user.banner) user.banner = null
  if (!user.likes) user.likes = []
  if (!user.reviews) user.reviews = []
  if (!user.watchlist) user.watchlist = []
  if (!user.watcheds) user.watcheds = []

  delete user.password

  return user as IUser
})
