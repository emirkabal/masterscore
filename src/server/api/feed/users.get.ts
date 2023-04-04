import UserModel from "../../models/User.model"

export default defineEventHandler(async (event) => {
  const data = await UserModel.find({})
    .sort({
      createdAt: -1
    })
    .limit(40)
    .select("username avatar")
    .lean()

  return data
})
