import { ErrorResponse, IUser } from "~/@types"
import UserModel from "~/server/models/User.model"

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    return { status: 401, message: "Unauthorized" } as ErrorResponse
  }

  if (event.context.user._id?.toString() !== "63f4dcf150582a1ca831f639") {
    return { status: 403, message: "Forbidden" } as ErrorResponse
  }

  const id = event.context.params?.id as string

  const body: {
    verified?: boolean
    features?: string[]
  } = await readBody(event)

  const user: Partial<IUser> | null = await UserModel.findById(id).lean()

  if (!user) {
    return { status: 404, message: "User not found" } as ErrorResponse
  }

  if (body.verified !== undefined) {
    user.verified = body.verified
  }

  if (body.features) {
    user.features = body.features
  }

  await UserModel.findByIdAndUpdate(id, user)

  return {
    status: 200,
    message: "User updated successfully",
    data: user
  }
})
