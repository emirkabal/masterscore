import prisma from "~/server/db/prisma"
import { getSyncedMedia } from "~/server/utils"

export default defineEventHandler(async (event) => {
  const tmdb_id = event.context.params?.id ? parseInt(event.context.params.id) : null
  const type = getQuery(event).type as "movie" | "tv"

  if (!tmdb_id)
    throw createError({
      statusCode: 400,
      statusMessage: "Media not found or is an adult content"
    })

  if (!type)
    throw createError({
      statusCode: 400,
      statusMessage: "Type not found"
    })

  const media = await getSyncedMedia(tmdb_id, type)

  if (!media)
    throw createError({
      statusCode: 404,
      statusMessage: "Media not found or is an adult content"
    })

  const score = await prisma.review.aggregate({
    where: {
      media_id: media.id,
      user: {
        suspended: false
      }
    },
    _avg: {
      rating: true
    }
  })

  return { ...media, score: score._avg?.rating || -1 }
})
