import { Document } from "mongoose"
import { ErrorResponse, IEntertainment, IReview, IUser } from "~/@types"
import EntertainmentModel from "~/server/models/Entertainment.model"
import UserModel from "~/server/models/User.model"
import ReviewModel from "~/server/models/Review.model"

export default defineEventHandler(async (event) => {
  const { id } = event.context.params as { id: string }
  if (!id) return { status: 400, message: "Missing author" } as ErrorResponse

  const user: Document<IUser> | null = await UserModel.findById(id)
  if (!user) return { status: 404, message: "User not found" } as ErrorResponse

  const featured: IReview[] = await ReviewModel.find({
    author: id
  })
    .populate({
      path: "entertainment",
      model: EntertainmentModel,
      select: "id type info.title info.poster"
    })
    .sort({ rating: -1 })
    .limit(10)
    .lean()

  await user.populate({
    path: "reviews",
    model: EntertainmentModel,
    select: "id type info.title info.poster",
    options: {
      sort: {
        createdAt: -1
      },
      limit: 10
    }
  })

  await user.populate({
    path: "likes",
    model: EntertainmentModel,
    select: "id type info.title info.poster",
    options: {
      sort: {
        createdAt: -1
      },
      limit: 10
    }
  })

  await user.populate({
    path: "watchlist",
    model: EntertainmentModel,
    select: "id type info.title info.poster",
    options: {
      sort: {
        createdAt: -1
      },
      limit: 10
    }
  })

  return {
    featured,
    // @ts-ignore
    reviews: user.reviews as IEntertainment[],
    // @ts-ignore
    likes: user.likes as IEntertainment[],
    // @ts-ignore
    watchlist: user.watchlist as IEntertainment[]
  }
})
