import { SignupSchema } from "~/utils/validation"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import prisma from "~/server/db/prisma"
import { isBannedUsername, randomNumber } from "~/server/utils"
const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, SignupSchema.parse)

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
  const revision = randomNumber(100000, 999999)

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
