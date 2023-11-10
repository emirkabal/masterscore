import type { ILike } from "~/types"
import LikeModel from "~/server/models/Like.model"
import EntertainmentModel from "~/server/models/Entertainment.model"

export default defineEventHandler(async (event) => {
  const { limit } = getQuery(event) as { limit: number | undefined }
  const entertainments: ILike[] = await LikeModel.find({
    likes: { $gt: 0 }
  })
    .limit(limit || 10)
    .sort({ likes: -1 })
    .populate({
      path: "entertainment",
      model: EntertainmentModel,
      select: "id type info.title info.poster"
    })
    .lean()
  return entertainments
})
