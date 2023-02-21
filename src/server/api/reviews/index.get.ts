import { IEntertainment } from "~~/src/@types"
import ReviewModel from "../../models/Review.model"

export default defineEventHandler(async (event) => {
  const { limit } = getQuery(event) as { limit: number | undefined }

  const average: {
    _id: string
    average: number
    entertainment: IEntertainment
  }[] = await ReviewModel.aggregate([
    {
      $group: {
        _id: "$entertainment",
        average: { $avg: "$rating" }
      }
    },
    {
      $project: {
        _id: 1,
        average: 1
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
    {
      $sort: {
        average: -1
      }
    }
  ]).limit(Number(limit) || 10)

  return average
})
