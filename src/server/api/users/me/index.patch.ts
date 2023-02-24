import { ErrorResponse, IUser } from "~/@types"
import UserModel from "~/server/models/User.model"
import { UserPatchableSchema } from "~/server/validation"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!event.context.user) {
    return { status: 401, message: "Unauthorized" } as ErrorResponse
  }

  const { error } = UserPatchableSchema.validate(body)
  if (error) {
    return { status: 400, message: error.message } as ErrorResponse
  }

  const user: Partial<IUser> = await UserModel.findById(
    event.context.user._id
  ).lean()

  if (user.latestUsernameChange && body.username) {
    const timeSinceLastChange =
      new Date().getTime() - user.latestUsernameChange.getTime()
    if (timeSinceLastChange < 1000 * 60 * 60 * 24 * 7) {
      return {
        status: 400,
        message: "You can only change your username once a week."
      } as ErrorResponse
    }
  }

  if (body.username) {
    const usernameExists = await UserModel.findOne({
      username: body.username
    }).lean()
    if (usernameExists) {
      return {
        status: 400,
        message: "Username already exists."
      } as ErrorResponse
    }
  }

  if (body.username) {
    user.username = body.username
    user.latestUsernameChange = new Date()
  }

  user.about = body.about || null
  user.banner = body.banner || null

  await UserModel.findByIdAndUpdate(event.context.user._id, user)

  return {
    status: 200,
    message: "User updated successfully"
  }
})
