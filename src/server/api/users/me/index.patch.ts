import { ErrorResponse, IUser } from "~/@types"
import UserModel from "~/server/models/User.model"
import { UserPatchableSchema } from "~/server/validation"
import { upload, remove } from "~/utils/fileManager"

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    return { status: 401, message: "Unauthorized" } as ErrorResponse
  }

  const body = await readBody(event)

  const { error } = UserPatchableSchema.validate(body)
  if (error) {
    return { status: 400, message: error.message } as ErrorResponse
  }

  const user: Partial<IUser> | null = await UserModel.findById(
    event.context.user._id
  ).lean()

  if (!user) {
    return { status: 404, message: "User not found" } as ErrorResponse
  }

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

  if (body.files && body.files.avatar) {
    if (user.avatar) {
      await remove("avatars/" + user.avatar)
      user.avatar = null
    }

    const res = await fetch(body.files.avatar.file)
    const blob = await res.blob()

    const message = await upload(blob)
    if (message.data) {
      user.avatar = message.data
    } else {
      return message
    }
  }

  if (user.avatar && body.avatar === "remove") {
    await remove("avatars/" + user.avatar)
    user.avatar = null
  }

  await UserModel.findByIdAndUpdate(event.context.user._id, user)

  return {
    status: 200,
    message: "User updated successfully",
    data: user
  }
})
