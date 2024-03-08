import prisma from "~/server/db/prisma"

export default eventHandler(async (event) => {
  const { id } = event.context.params as { id: string }
  if (!id) throw createError({ statusCode: 400, statusMessage: "Bad request" })

  const media = await prisma.media
    .findUnique({
      where: {
        id
      }
    })
    .catch(() => null)

  if (!media) throw createError({ statusCode: 404, statusMessage: "Media not found" })

  const reviews = await prisma.review.findMany({
    where: {
      media_id: media.id
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true
        }
      }
    }
  })

  return {
    status: 200,
    reviews
  }
})
