import { z } from "zod"
import prisma from "~/server/db/prisma"

export default defineEventHandler(async (event) => {
  const { id } = event.context.params as { id: string }

  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: "Unauthorized" })

  if (!id)
    throw createError({
      statusCode: 400,
      statusMessage: "Bad request"
    })

  const body = await readValidatedBody(
    event,
    z.object({
      rating: z.number().min(0.5).max(10),
      content: z.string().max(512).nullable().optional(),
      spoiler: z.boolean().nullable().optional()
    }).parse
  )

  const media = await prisma.media.findUnique({
    where: {
      id
    }
  })
  if (!media) throw createError({ statusCode: 404, statusMessage: "Media not found" })

  const { rating, content, spoiler } = body

  await prisma.review.upsert({
    create: {
      media: {
        connect: {
          id
        }
      },
      user: {
        connect: {
          id: user.id
        }
      },
      rating,
      content,
      spoiler
    },

    update: {
      rating,
      content,
      spoiler
    },

    where: {
      media_id_user_id: {
        media_id: id,
        user_id: user.id
      }
    }
  })

  return {
    status: 200,
    message: "Review added"
  }
})
