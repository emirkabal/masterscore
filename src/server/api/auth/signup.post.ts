import { UserSchema } from "~/server/validation"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import prisma from "~/server/db/prisma"
const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { error } = UserSchema.validate(body)
  if (error)
    throw createError({
      statusCode: 400,
      message: error.message
    })

  const exists = await prisma.user.findFirst({
    where: {
      OR: [
        {
          username: {
            equals: body.username,
            mode: "insensitive"
          }
        },
        {
          email: {
            equals: body.email,
            mode: "insensitive"
          }
        }
      ]
    }
  })

  if (exists)
    throw createError({
      statusCode: 400,
      statusMessage: "Email or username already exists"
    })

  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(body.password, salt)

  const user = await prisma.user.create({
    data: {
      username: body.username,
      email: body.email,
      password: hash
    }
  })

  const secret = config.JWT_SECRET
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    secret
  )
  return {
    status: 200,
    token
  }
})
