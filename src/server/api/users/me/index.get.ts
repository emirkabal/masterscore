import { ErrorResponse, IUser } from "~/@types"
import fixUserNullables from "~/utils/fixUserNullables"

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    return { status: 401, message: "Unauthorized" } as ErrorResponse
  }

  let user = event.context.user as IUser
  user = fixUserNullables(user)

  return user as IUser
})
