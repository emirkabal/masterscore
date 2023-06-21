import { IActivity } from "~/@types"
import ActivityModel from "~/server/models/Activity.model"
import EntertainmentModel from "../../models/Entertainment.model"
import UserModel from "../../models/User.model"
import ReviewModel from "../../models/Review.model"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { author, entertainment, type, page, limit } = query as {
    author: string | undefined
    entertainment: string | undefined
    type: string | undefined
    expand: boolean | undefined
    limit: number | undefined
    page: number | undefined
  }

  const initialPage = page ? page - 1 : 0
  const initialLimit = Math.min(limit || 10, 50)

  const activities: IActivity[] = await ActivityModel.find({
    ...(author ? { author } : {}),
    ...(entertainment ? { entertainment } : {}),
    ...(type
      ? {
          type: {
            $in: type.split(",")
          }
        }
      : {})
  })
    .sort({ createdAt: -1 })
    .skip(initialPage * initialLimit)
    .limit(initialLimit)
    .populate({
      path: "author",
      model: UserModel,
      select: "username avatar verified -_id"
    })
    .populate({
      path: "entertainment",
      model: EntertainmentModel,
      select: "id type info.title info.poster -_id"
    })
    .populate({
      path: "review",
      model: ReviewModel,
      select: "content rating spoiler -_id"
    })
    .lean()

  return activities
})
