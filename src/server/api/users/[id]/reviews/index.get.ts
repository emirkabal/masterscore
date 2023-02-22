import { ErrorResponse, IReview } from "~/@types"
import EntertainmentModel from "~/server/models/Entertainment.model"
import ReviewModel from "~/server/models/Review.model"

export default defineEventHandler(async (event) => {
  const { id } = event.context.params as { id: string }
  if (!id) return { status: 400, message: "Missing author" } as ErrorResponse
  const reviews: IReview[] = await ReviewModel.find({
    author: id
  })
    .populate({
      path: "entertainment",
      model: EntertainmentModel,
      select: "id type info.title info.poster"
    })
    .sort({ createdAt: -1 })
    .lean()

  return reviews
})
