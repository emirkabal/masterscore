import { IReview } from "~/@types"
import EntertainmentModel from "../../models/Entertainment.model"
import ReviewModel from "../../models/Review.model"
import UserModel from "../../models/User.model"

export default defineEventHandler(async (event) => {
  const data: IReview[] = await ReviewModel.find({})
    .sort({ createdAt: -1 })
    .limit(10)
    .populate({
      model: EntertainmentModel,
      path: "entertainment",
      select: "id type info.title info.poster"
    })
    .populate({
      model: UserModel,
      path: "author",
      select: "username -_id"
    })

  return data
})
