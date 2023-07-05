import UserModel from "~/server/models/User.model"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { IUser } from "~/@types"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const username = body.username.toLowerCase()
  const user: IUser | null = await UserModel.findOne({
    $or: [
      {
        username
      },
      {
        email: username
      }
    ]
  }).lean()

  if (!user)
    return {
      status: 400,
      message: "Username or password invalid."
    }

  const valid = bcrypt.compareSync(body.password, user.password)
  if (!valid)
    return {
      status: 400,
      message: "Username or password invalid."
    }
  const secret = user.password + user.createdAt
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email
    },
    secret
  )

  return { status: 200, token }
})
