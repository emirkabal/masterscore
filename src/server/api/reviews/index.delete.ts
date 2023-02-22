import { ErrorResponse } from "~/@types"
import ActivityModel from "~/server/models/Activity.model"
import ReviewModel from "~/server/models/Review.model"
import UserModel from "~/server/models/User.model"
import grabUserWithoutPassword from "~/utils/grabUserWithoutPassword"

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    return { status: 401, message: "Unauthorized" } as ErrorResponse
  }
  const body = await readBody(event)
  const { entertainment } = body as {
    entertainment: string
  }
  if (!entertainment)
    return {
      status: 400,
      message: "Missing entertainment"
    } as ErrorResponse

  const user = grabUserWithoutPassword(event.context.user)

  if (
    user.reviews &&
    !user.reviews.map((e) => e.toString()).includes(entertainment)
  ) {
    return {
      status: 400,
      message: "You haven't reviewed this entertainment"
    } as ErrorResponse
  }

  await ReviewModel.findOneAndDelete({
    entertainment,
    author: user._id
  })

  await UserModel.findByIdAndUpdate(user._id, {
    $pull: { reviews: entertainment }
  })

  await ActivityModel.findOneAndDelete({
    type: "review",
    entertainment,
    author: user._id as string
  })

  return { status: 200, message: "Deleted" }
})
