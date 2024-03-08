import prisma from "~/server/db/prisma"

export default defineEventHandler(async (event) => {
  const { limit, type, disableReviewRequirement } = getQuery(event) as {
    limit: number | undefined
    type: string | undefined
    disableReviewRequirement: boolean | undefined
  }

  const t = await prisma.review.aggregateRaw({
    pipeline: [
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
          from: "Entertainment",
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
      },
      {
        $limit: Number(limit) || 10
      }
    ]
  })

  return t
})
