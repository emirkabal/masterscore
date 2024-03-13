import { z } from "zod"
import bcrypt from "bcrypt"
import prisma from "~/server/db/prisma"

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: "Unauthorized" })

  const body = await readValidatedBody(
    event,
    z.object({
      new_email: z.string().email(),
      password: z.string()
    }).parse
  )

  if (user.email === body.new_email)
    throw createError({ statusCode: 400, statusMessage: "You are already using this email." })

  const valid = bcrypt.compareSync(body.password, user.password)
  if (!valid) throw createError({ statusCode: 400, statusMessage: "Wrong password." })

  const emailExists = await prisma.user.findFirst({
    where: {
      email: body.new_email
    }
  })
  if (emailExists)
    throw createError({
      statusCode: 400,
      statusMessage: "Email already taken by another user."
    })

  await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      email: body.new_email
    }
  })

  return { status: 200, message: "Email changed successfully." }
})
