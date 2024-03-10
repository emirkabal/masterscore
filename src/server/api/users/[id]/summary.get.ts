import { getUser } from "~/server/utils"
import prisma from "~/server/db/prisma"

export default defineEventHandler(async (event) => {
  const { id } = event.context.params as { id: string }
  if (!id) throw createError({ statusCode: 400, statusMessage: "Bad request" })

  const user = await getUser(id)
  if (!user) throw createError({ statusCode: 404, statusMessage: "User not found" })

  const select = {
    id: true,
    media: {
      select: {
        title: true,
        tmdb_id: true,
        type: true,
        images: {
          select: {
            poster: true
          }
        }
      }
    },
    created_at: true
  }

  const [featured, last_reviews, last_likes] = await prisma
    .$transaction([
      prisma.review.findMany({
        where: {
          user_id: user.id
        },
        orderBy: {
          rating: "desc"
        },
        select,
        take: 10
      }),
      prisma.review.findMany({
        where: {
          user_id: user.id
        },
        orderBy: {
          created_at: "desc"
        },
        select,
        take: 10
      }),
      prisma.like.findMany({
        where: {
          user_id: user.id
        },
        orderBy: {
          created_at: "desc"
        },
        select,
        take: 10
      })
    ])
    .catch(() => {
      throw createError({ statusCode: 500, statusMessage: "dumbass" })
    })

  return {
    featured,
    last_reviews,
    last_likes
  }
})
