import { UserSchema } from "~/server/validation"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import prisma from "~/server/db/prisma"
import { isBannedUsername } from "~/server/utils"
const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { error } = UserSchema.validate(body)
  if (error)
    throw createError({
      statusCode: 400,
      statusMessage: error.message
    })

  const username = body.username.toLowerCase()

  if (isBannedUsername(username))
    throw createError({
      statusCode: 400,
      statusMessage: "Username is not allowed."
    })

  const exists = await prisma.user.findFirst({
    where: {
      OR: [
        {
          username
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
  const revision = Math.floor((Math.random() * Date.now()) / 1000)

  const user = await prisma.user.create({
    data: {
      username,
      email: body.email,
      password: hash,
      revision
    }
  })

  const secret = config.JWT_SECRET
  const token = jwt.sign(
    {
      id: user.id,
      revision: user.revision
    },
    secret
  )
  return {
    status: 200,
    token
  }
})
