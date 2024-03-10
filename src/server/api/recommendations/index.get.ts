import prisma from "~/server/db/prisma"
import type { TMDBResult, TMDBSearchResults } from "~/types"
import getISO from "~/utils/getISO"
const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: "Unauthorized" })

  if (!user.likes?.length)
    throw createError({ statusCode: 400, statusMessage: "You don't have any liked entertainment" })

  const _ = await prisma.user.findUniqueOrThrow({
    where: {
      id: user.id
    },
    include: {
      likes: {
        include: {
          media: true
        }
      },
      reviews: {
        include: {
          media: true
        }
      }
    }
  })

  if (!_) throw createError({ statusCode: 404, statusMessage: "User not found" })

  const { likes, reviews } = _

  const related = likes[Math.floor(Math.random() * likes.length)].media

  const lang = getISO(getCookie(event, "locale"))
  const data = await $fetch<TMDBSearchResults<TMDBResult>>(
    `https://api.themoviedb.org/3/${related.type}/${related.tmdb_id}/recommendations?api_key=${config.TMDB_API_KEY}&language=${lang}`
  )

  data.results = data.results.filter((result) => result.poster_path && result.backdrop_path)
  likes.forEach((like) => {
    data.results = data.results.filter(
      (result) =>
        !(
          result.id?.toString() === like.media.tmdb_id.toString() &&
          result.media_type === like.media.type
        )
    )
  })

  reviews.forEach((review) => {
    data.results = data.results.filter(
      (result) =>
        !(
          result.id?.toString() === review.media.tmdb_id.toString() &&
          result.media_type === review.media.type
        )
    )
  })

  return { related, results: data }
})
