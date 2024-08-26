import { z } from "zod"
import prisma from "~/server/db/prisma"

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(
    event,
    z.object({
      limit: z.string().optional().default("10"),
      page: z.string().optional().default("1")
    }).parse
  )

  const limit = Math.min(parseInt(query.limit), 50)
  const page = Math.max(parseInt(query.page), 1)

  const [likes, reviews] = await prisma.$transaction([
    prisma.like.findMany({
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        created_at: "desc"
      },
      where: {
        user: {
          suspended: false
        }
      },
      include: {
        user: {
          select: {
            display_name: true,
            username: true,
            avatar: true,
            verified: true
          }
        },
        media: {
          select: {
            title: true,
            type: true,
            tmdb_id: true,
            images: {
              select: {
                poster: true
              }
            }
          }
        }
      }
    }),
    prisma.review.findMany({
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        created_at: "desc"
      },
      where: {
        user: {
          suspended: false
        }
      },
      include: {
        user: {
          select: {
            display_name: true,
            username: true,
            avatar: true,
            verified: true,
            flags: true
          }
        },
        media: {
          select: {
            title: true,
            type: true,
            tmdb_id: true,
            images: {
              select: {
                poster: true
              }
            }
          }
        }
      }
    })
  ])

  return [
    ...likes.map((e) => {
      return {
        type: "like",
        ...e
      }
    }),
    ...reviews.map((e) => {
      return {
        type: "review",
        ...e
      }
    })
  ].sort((a, b) => {
    return a.created_at > b.created_at ? -1 : 1
  })
})
