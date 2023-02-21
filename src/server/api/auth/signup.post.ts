import UserModel from "~/server/models/User.model"
import { UserSchema } from "~/server/validation"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { error } = UserSchema.validate(body)
  if (error) return { status: 400, message: error.message }

  const exists = await UserModel.findOne({
    $or: [
      {
        username: body.username
      },
      {
        email: body.email
      }
    ]
  }).lean()

  if (exists)
    return {
      status: 400,
      message: "Username or email already exists"
    }

  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(body.password, salt)

  const user = await UserModel.create({ ...body, password: hash })
  const secret = hash + user.createdAt
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email
    },
    secret
  )
  return {
    status: 200,
    token
  }
})
