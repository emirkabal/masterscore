import { ILike } from "~/@types"
import LikeModel from "~/server/models/Like.model"

export default defineEventHandler(async (event) => {
  const { limit } = getQuery(event) as { limit: number | undefined }
  const entertainments: ILike[] = await LikeModel.find({
    likes: { $gt: 0 }
  })
    .limit(limit || 10)
    .sort({ likes: -1 })
    .populate("entertainment", "id type info.title info.poster")
    .lean()
  return entertainments
})
