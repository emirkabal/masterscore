import { ErrorResponse, IUser } from "~/@types"
import UserModel from "~/server/models/User.model"
import fixUserNullables from "~/utils/fixUserNullables"

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id as string
  if (!id) {
    return { status: 400, message: "Missing id" } as ErrorResponse
  }

  let user: Partial<IUser> | null = await UserModel.findOne({
    username: {
      $regex: new RegExp(`^${id}$`, "i")
    }
  }).lean()

  if (!user) {
    return { status: 404, message: "User not found" } as ErrorResponse
  }

  user = fixUserNullables(user)

  delete user.password
  delete user.email

  return user as IUser
})
