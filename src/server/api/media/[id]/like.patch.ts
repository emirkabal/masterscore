import prisma from "~/server/db/prisma"

export default defineEventHandler(async (event) => {
  const { id } = event.context.params as { id: string }
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: "Unauthorized" })

  //media.likes is a Like[]
  const like = await prisma.like.findUnique({
    where: {
      user_id_media_id: {
        media_id: id,
        user_id: user.id
      }
    }
  })

  if (like) {
    await prisma.like.delete({
      where: {
        id: like.id
      }
    })
    return { liked: false }
  }

  await prisma.like.create({
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

  return { liked: true }
})
