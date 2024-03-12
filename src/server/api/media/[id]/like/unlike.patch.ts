import prisma from "~/server/db/prisma"

export default defineEventHandler(async (event) => {
  const { id } = event.context.params as { id: string }
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: "Unauthorized" })

  await prisma.like
    .delete({
      where: {
        user_id_media_id: {
          user_id: user.id,
          media_id: id
        }
      }
    })
    .catch(() => {})

  return { liked: false }
})
