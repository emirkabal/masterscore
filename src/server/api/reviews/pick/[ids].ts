import prisma from "~/server/db/prisma"
import type { MediaType } from "~/types"

export default defineEventHandler(async (event) => {
  const { ids } = event.context.params as { ids: string }
  const query = getQuery(event)
  const { type, need_reviews } = query as { type: MediaType; need_reviews?: boolean }

  const list = ids.split(",").map(Number)
  if (!list.length || list.length > 100) return []

  const [scores, related] = await Promise.all([
    prisma.review.groupBy({
      by: "media_id",

      where: {
        media: {
          tmdb_id: {
            in: list
          },
          type
        }
      },
      _avg: {
        rating: true
      },
      having: {
        rating: {
          _count: {
            gte: need_reviews ? 3 : 0
          }
        }
      }
    }),
    prisma.media.findMany({
      where: {
        tmdb_id: {
          in: list
        },
        type
      },
      select: {
        id: true,
        tmdb_id: true
      }
    })
  ])

  return related
    .map((media) => {
      const rating = scores.find((s) => s.media_id === media.id)
      return {
        id: media.id,
        tmdb_id: media.tmdb_id,
        score: rating?._avg?.rating
      }
    })
    .sort((a, b) => list.indexOf(a.tmdb_id) - list.indexOf(b.tmdb_id))
})
