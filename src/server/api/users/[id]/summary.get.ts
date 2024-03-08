import prisma from "~/server/db/prisma"

export default defineEventHandler(async (event) => {
  const { id } = event.context.params as { id: string }
  if (!id) throw createError({ statusCode: 400, statusMessage: "Bad request" })

  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) throw createError({ statusCode: 404, statusMessage: "User not found" })

  const featured = await prisma.review.findMany({
    where: {
      user_id: id
    },
    orderBy: {
      rating: "desc"
    },
    include: {
      media: true
    },
    take: 10
  })

  const last_reviews = await prisma.review.findMany({
    where: {
      user_id: id
    },
    orderBy: {
      created_at: "desc"
    },
    include: {
      media: true
    },
    take: 10
  })

  const last_likes = await prisma.like.findMany({
    where: {
      user_id: id
    },
    orderBy: {
      created_at: "desc"
    },
    include: {
      media: true
    },
    take: 10
  })

  return {
    featured,
    last_reviews,
    last_likes
  }
})
