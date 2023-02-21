import { ErrorResponse, ILike } from "~/@types"
import LikeModel from "~/server/models/Like.model"

export default defineEventHandler(async (event) => {
  const id = event?.context?.params?.id as string
  if (!id) return { status: 400, message: "Missing id" } as ErrorResponse

  const likes: ILike | null = await LikeModel.findOne({
    entertainment: id
  })

  return {
    status: 200,
    likes: likes?.likes || 0
  }
})
