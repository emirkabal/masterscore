import { ErrorResponse, IUser } from "~~/@types"

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    return { status: 401, message: "Unauthorized" } as ErrorResponse
  }

  let user = event.context.user as IUser
  if (!user.about) user.about = null
  if (!user.banner) user.banner = null
  if (!user.likes) user.likes = []
  if (!user.reviews) user.reviews = []
  if (!user.watchlist) user.watchlist = []
  if (!user.watcheds) user.watcheds = []

  return user as IUser
})
