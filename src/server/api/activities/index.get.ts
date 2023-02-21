import { IActivity } from "~/@types"
import ActivityModel from "~/server/models/Activity.model"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { author, entertainment, type } = query as {
    author: string | undefined
    entertainment: string | undefined
    type: "like" | "review" | undefined
  }

  const activities: IActivity[] = await ActivityModel.find({
    ...(author ? { author } : {}),
    ...(entertainment ? { entertainment } : {}),
    ...(type ? { type } : {})
  })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("author", "username -_id")
    .populate("entertainment", "id type info.title info.poster -_id")
    .lean()

  return activities
})
