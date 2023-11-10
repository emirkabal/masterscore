import type { ILike } from "~/types"
import LikeModel from "~/server/models/Like.model"

export default defineEventHandler(async (event) => {
  const id = event?.context?.params?.id as string
  if (!id) return createError({ statusCode: 400, message: "missing id" })

  const likes: ILike | null = await LikeModel.findOne({
    entertainment: id
  })

  return {
    status: 200,
    likes: likes?.likes || 0
  }
})
