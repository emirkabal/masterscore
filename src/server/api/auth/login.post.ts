import UserModel from "~/server/models/User.model"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import type { IUser } from "~/types"
import { LoginSchema } from "~/server/validation"
const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { error } = LoginSchema.validate(body)

  if (error)
    return createError({
      status: 400,
      message: error.message
    })

  const user: IUser | null = await UserModel.findOne({
    $or: [
      {
        username: body.username
      },
      {
        email: body.username
      },
      {
        username: new RegExp(`^${body.username}$`, "i")
      }
    ]
  }).lean()

  if (!user)
    return createError({
      status: 400,
      message: "Username or password invalid."
    })

  const valid = bcrypt.compareSync(body.password, user.password)
  if (!valid)
    return createError({
      status: 400,
      message: "Username or password invalid."
    })

  const secret = config.JWT_SECRET + user.password
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email
    },
    secret
  )

  return { status: 200, token }
})
