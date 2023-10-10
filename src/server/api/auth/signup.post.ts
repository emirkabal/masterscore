import UserModel from "~/server/models/User.model"
import { UserSchema } from "~/server/validation"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { error } = UserSchema.validate(body)
  if (error)
    return createError({
      status: 400,
      message: error.message
    })

  if (!body.inviteCode)
    return createError({
      status: 400,
      message: "Invite code is required"
    })

  if (body.inviteCode !== config.INVITE_CODE)
    return createError({
      status: 400,
      message: "Invalid invite code"
    })

  const exists = await UserModel.findOne({
    $or: [
      {
        username: body.username
      },
      {
        username: new RegExp(`^${body.username}$`, "i")
      },
      {
        email: body.email
      }
    ]
  }).lean()

  if (exists)
    return createError({
      status: 400,
      message: "Email or username already exists"
    })

  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(body.password, salt)

  const user = await UserModel.create({ ...body, password: hash })
  const secret = config.JWT_SECRET + hash
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
