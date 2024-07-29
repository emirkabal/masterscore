import { getTopMediaByReviews } from "~/server/utils"

export default defineEventHandler(async (event) => {
  const { limit, type, disableReviewRequirement } = getQuery(event) as {
    limit?: number
    type?: string
    disableReviewRequirement?: boolean
  }

  const data = await getTopMediaByReviews({
    limit,
    type,
    disableReviewRequirement
  })

  return data
})
