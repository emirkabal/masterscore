import type { ErrorResponse } from "~/types"
import ActivityModel from "~/server/models/Activity.model"
import LikeModel from "~/server/models/Like.model"
import UserModel from "~/server/models/User.model"
import grabUserWithoutPassword from "~/utils/grabUserWithoutPassword"

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    return { status: 401, message: "Unauthorized" } as ErrorResponse
  }
  const body = await readBody(event)
  const { id, type } = body as {
    id: string
    type: "remove" | "add"
  }
  if (!id || !type)
    return {
      status: 400,
      message: "Missing entertainment"
    } as ErrorResponse

  const user = grabUserWithoutPassword(event.context.user)
  if (user.likes && user.likes.map((e) => e.toString()).includes(id) && type === "remove") {
    await UserModel.findOneAndUpdate({ _id: user._id }, { $pull: { likes: id } })
    const { likes } = await LikeModel.findOneAndUpdate(
      { entertainment: id },
      { $inc: { likes: -1 } },
      { upsert: true, new: true }
    )
    await ActivityModel.deleteMany({
      type: "like",
      entertainment: id,
      author: user._id as string
    })

    return { status: 200, message: "Unliked", likes }
  } else if (user.likes && !user.likes.map((e) => e.toString()).includes(id) && type === "add") {
    await UserModel.findOneAndUpdate({ _id: user._id }, { $push: { likes: id } })
    const { likes } = await LikeModel.findOneAndUpdate(
      { entertainment: id },
      { $inc: { likes: 1 } },
      { upsert: true, new: true }
    )
    await ActivityModel.create({
      author: user._id as string,
      entertainment: id,
      type: "like"
    })
    return { status: 200, message: "Liked", likes }
  } else {
    return { status: 200, message: "Already liked", likes: 0 }
  }
})
