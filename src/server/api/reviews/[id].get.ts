import type { ErrorResponse, IReview } from "~/types"
import { Types } from "mongoose"
import ReviewModel from "~/server/models/Review.model"
import UserModel from "../../models/User.model"

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
      .populate({
        path: "author",
        model: UserModel,
        select: "_id username avatar verified"
      })
      .select("-entertainment -_id")
      .lean()
  }
  let reviews: IReview[] | null = await ReviewModel.find({
    entertainment: id
  })
    .sort({ createdAt: -1 })
    .limit(25)
    .select("-entertainment -_id")
    .populate({
      path: "author",
      model: UserModel,
      select: "_id username avatar verified"
    })
    .lean()

  if (review && reviews) {
    reviews = reviews.filter(
      (r) => r.author._id?.toString() != review?.author._id?.toString()
    )
    reviews.unshift(review)
  }

  const average = await ReviewModel.aggregate([
    {
      $match: {
        entertainment: new Types.ObjectId(id)
      }
    },
    {
      $group: {
        _id: null,
        rating: { $avg: "$rating" },
        good: {
          $sum: {
            $cond: [{ $gte: ["$rating", 7] }, 1, 0]
          }
        },
        poor: {
          $sum: {
            $cond: [{ $lt: ["$rating", 7] }, 1, 0]
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        rating: 1,
        good: 1,
        poor: 1,
        overall: {
          $cond: {
            if: { $gte: ["$rating", 7] },
            then: "good",
            else: "poor"
          }
        }
      }
    }
  ])

  return {
    status: 200,
    count,
    average: average[0],
    review,
    reviews
  }
})
