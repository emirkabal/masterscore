import { z } from "zod"
import prisma from "~/server/db/prisma"

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id as string
  if (!id) throw createError({ statusCode: 400, statusMessage: "Bad request" })

  const query = await getValidatedQuery(
    event,
    z.object({
      limit: z.string().optional().default("10"),
      page: z.string().optional().default("1")
    }).parse
  )

  const limit = Math.min(parseInt(query.limit), 50)
  const page = Math.max(parseInt(query.page), 1)

  const data = await prisma.review.findMany({
    take: limit,
    skip: (page - 1) * limit,
    orderBy: {
      created_at: "desc"
    },
    where: {
      user: {
        username: id,
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
  })

  return data
})
