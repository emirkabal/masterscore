import prisma from "~/server/db/prisma"

export default defineEventHandler(async (event) => {
  const { limit, type, disableReviewRequirement } = getQuery(event) as {
    limit: number | undefined
    type: string | undefined
    disableReviewRequirement: boolean | undefined
  }

  const raw = await prisma.review.groupBy({
    by: ["media_id"],
    _avg: { rating: true },
    _count: true,
    having: {
      rating: {
        _count: {
          gt: 0
        }
      }
    },
    orderBy: {
      _avg: {
        rating: "desc"
      }
    },
    take: 100
  })

  const reviews = await prisma.review.findMany({
    where: {
      media_id: {
        in: raw.map((r) => r.media_id)
      }
    },
    include: {
      media: true
    }
  })

  const result = raw.map((r) => {
    const review = reviews.find((review) => review.media_id === r.media_id)
    return {
      media: review?.media,
      score: r._avg.rating,
      count: r._count
    }
  })

  return result
})
