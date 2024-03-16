import prisma from "~/server/db/prisma"

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

  if (user.suspended)
    throw createError({ statusCode: 403, statusMessage: "User has been suspended" })

  const { password, email, revision, suspended, ...customUser } = user

  return customUser
})
