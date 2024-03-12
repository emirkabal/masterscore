import prisma from "~/server/db/prisma"

export default defineEventHandler(async (event) => {
  if (!event.context.user) throw createError({ statusCode: 401, statusMessage: "Unauthorized" })

  const user = await prisma.user.findUnique({
    where: {
      id: event.context.user.id
    },
    include: {
      likes: {
        select: {
          media_id: true
        }
      },
      reviews: {
        select: {
          media_id: true
        }
      },
      collections: {
        include: {
          list: true
        }
      }
    }
  })

  if (!user) throw createError({ statusCode: 404, statusMessage: "Not Found" })

  const { password, revision, ...passwordLess } = user

  return {
    ...passwordLess,
    likes: user.likes.map((like) => like.media_id),
    reviews: user.reviews.map((review) => review.media_id),
    collections: user.collections.map((collection) => ({
      ...collection,
      list: collection.list.map((media) => media.media_id)
    }))
  }
})
