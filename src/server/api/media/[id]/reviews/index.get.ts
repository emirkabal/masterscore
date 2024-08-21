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

  const select = {
    id: true,
    rating: true,
    content: true,
    spoiler: true,
    user: {
      select: {
        id: true,
        display_name: true,
        username: true,
        avatar: true,
        verified: true,
        flags: true
      }
    },
    created_at: true,
    updated_at: true
  }

  const [by_me, reviews] = await Promise.all([
    event.context.user?.id
      ? prisma.review.findUnique({
          where: {
            media_id_user_id: {
              media_id: media.id,
              user_id: event.context.user?.id
            }
          },
          select
        })
      : Promise.resolve(null),
    prisma.review.findMany({
      where: {
        media_id: media.id,
        user: {
          id: {
            not: event.context.user?.id
          },
          suspended: false
        }
      },

      select,
      orderBy: [
        {
          user: {
            verified: "desc"
          }
        },
        {
          content: "desc"
        },
        {
          created_at: "desc"
        }
      ]
    })
  ])
  return {
    by_me,
    reviews
  }
})
