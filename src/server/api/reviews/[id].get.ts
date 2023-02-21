import { Types } from "mongoose"
import { ErrorResponse, IReview } from "~/@types"
import ReviewModel from "~/server/models/Review.model"

export default defineEventHandler(async (event) => {
  const id = event?.context?.params?.id as string
  if (!id) return { status: 400, message: "Missing id" } as ErrorResponse

  const count = await ReviewModel.countDocuments({
    entertainment: id
  })
  let review: IReview | null = null
  if (event.context.user) {
    review = await ReviewModel.findOne({
      entertainment: id,
      author: event.context.user._id
    })
      .select("-entertainment -_id")
      .lean()
  }
  const reviews: IReview[] | null = await ReviewModel.find({
    entertainment: id
  })
    .sort({ createdAt: -1 })
    .limit(10)
    .select("-entertainment -_id")
    .populate("author", "_id username")
    .lean()

  const average = await ReviewModel.aggregate([
    {
      $match: {
        entertainment: new Types.ObjectId(id)
      }
    },
    {
      $group: {
        _id: null,
        average: { $avg: "$rating" }
      }
    }
  ])

  return {
    status: 200,
    count,
    averageRating: Number(average[0]?.average.toFixed(1)) || 0,
    review,
    reviews
  }
})
