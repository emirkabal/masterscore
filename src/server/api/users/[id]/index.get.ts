import prisma from "~/server/db/prisma"
import { getUser } from "~/server/utils"

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id as string
  if (!id) throw createError({ statusCode: 400, statusMessage: "Bad request" })

  const user = await prisma.user.findUnique({
    where: {
      username: id
    },
    include: {
      _count: {
        select: {
          likes: true,
          reviews: true,
          collections: true
        }
      }
    }
  })
  if (!user) throw createError({ statusCode: 404, statusMessage: "User not found" })

  const { password, email, ...customUser } = user

  return customUser
})
