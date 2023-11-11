import type { ErrorResponse } from "~/types"
import ActivityModel from "~/server/models/Activity.model"
import ReviewModel from "~/server/models/Review.model"
import Entertainment from "~/server/models/Entertainment.model"
import UserModel from "~/server/models/User.model"
import grabUserWithoutPassword from "~/utils/grabUserWithoutPassword"
import { ReviewSchema } from "~/server/validation"

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    return { status: 401, message: "Unauthorized" } as ErrorResponse
  }
  const body = await readBody(event)
  const { id, rating, review, spoiler } = body as {
    id: string
    rating: number
    review: string
    spoiler: boolean
  }
  if (!id)
    return {
      status: 400,
      message: "Missing entertainment"
    } as ErrorResponse

  const { error } = ReviewSchema.validate(body)
  if (error) return { status: 400, message: error.message } as ErrorResponse

  const user = grabUserWithoutPassword(event.context.user)

  const entertainment = await Entertainment.findById(id)
  if (!entertainment)
    return {
      status: 404,
      message: "Entertainment not found"
    } as ErrorResponse

  const reviewData = await ReviewModel.findOneAndUpdate(
    { entertainment: id, author: user._id },
    {
      $set: {
        rating,
        content: review || undefined,
        spoiler: spoiler || undefined,
        author: user._id,
        entertainment: id
      },
      $unset: {
        content: review ? undefined : 0,
        spoiler: spoiler ? undefined : 0
      }
    },
    {
      upsert: true,
      new: true
    }
  )
  await ActivityModel.findOneAndUpdate(
    {
      entertainment: id,
      author: user._id,
      type: "review"
    },
    {
      $set: {
        type: "review",
        attribute: rating,
        entertainment: id,
        review: reviewData._id,
        author: user._id
      }
    },
    {
      upsert: true,
      new: true
    }
  )
  if (user.reviews && !user.reviews.map((e) => e.toString()).includes(id)) {
    await UserModel.findByIdAndUpdate(user._id, {
      $push: { reviews: id }
    })
  }

  return {
    status: 200,
    message: "Review added"
  }
})
