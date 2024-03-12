import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { LoginSchema } from "~/server/validation"
import prisma from "~/server/db/prisma"
const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { error } = LoginSchema.validate(body)

  if (error)
    throw createError({
      statusCode: 400,
      message: error.message
    })

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        {
          username: body.username
        },
        {
          email: body.username
        },
        {
          username: {
            contains: body.username,
            mode: "insensitive"
          }
        }
      ]
    }
  })

  if (!user)
    throw createError({
      statusCode: 400,
      statusMessage: "Username or password invalid."
    })

  const valid = bcrypt.compareSync(body.password, user.password)
  if (!valid)
    throw createError({
      statusCode: 400,
      statusMessage: "Username or password invalid."
    })

  const secret = config.JWT_SECRET
  const token = jwt.sign(
    {
      id: user.id,
      revision: user.revision
    },
    secret
  )

  return { status: 200, token }
})
