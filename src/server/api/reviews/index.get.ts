import { IEntertainment } from "~~/src/@types"
import ReviewModel from "../../models/Review.model"

export default defineEventHandler(async (event) => {
  const { limit, type, disableReviewRequirement } = getQuery(event) as {
    limit: number | undefined
    type: string | undefined
    disableReviewRequirement: boolean | undefined
  }

  const average: {
    _id: string
    average: number
    entertainment: IEntertainment
  }[] = await ReviewModel.aggregate([
    {
      $group: {
        _id: "$entertainment",
        average: { $avg: "$rating" },
        reviewsCount: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 1,
        average: 1,
        reviewsCount: 1
      }
    },
    {
      $lookup: {
        from: "entertainments",
        localField: "_id",
        foreignField: "_id",
        as: "entertainment"
      }
    },
    {
      $unwind: "$entertainment"
    },
    (type && { $match: { "entertainment.type": type } }) || { $match: {} },
    (!disableReviewRequirement && {
      $match: {
        reviewsCount: { $gt: 2 }
      }
    }) || { $match: {} },
    {
      $sort: {
        average: -1
      }
    }
  ]).limit(Number(limit) || 10)

  return average
})
