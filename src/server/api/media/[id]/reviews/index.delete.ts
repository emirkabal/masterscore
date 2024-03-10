import prisma from "~/server/db/prisma"

export default defineEventHandler(async (event) => {
  const { id } = event.context.params as { id: string }

  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: "Unauthorized" })

  const review = await prisma.review.findUnique({
    where: {
      media_id_user_id: {
        media_id: id,
        user_id: user.id
      }
    }
  })

  if (!review) throw createError({ statusCode: 404, statusMessage: "Review not found" })

  await prisma.review.delete({
    where: {
      id: review.id
    }
  })

  return { deleted: true }
})
