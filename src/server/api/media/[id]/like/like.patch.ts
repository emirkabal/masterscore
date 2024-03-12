import prisma from "~/server/db/prisma"

export default defineEventHandler(async (event) => {
  const { id } = event.context.params as { id: string }
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: "Unauthorized" })

  await prisma.like
    .create({
      data: {
        user: {
          connect: {
            id: user.id
          }
        },
        media: {
          connect: {
            id
          }
        }
      }
    })
    .catch(() => {})

  return { liked: true }
})
