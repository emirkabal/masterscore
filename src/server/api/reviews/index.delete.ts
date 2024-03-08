export default defineEventHandler(async (event) => {
  if (!event.context.user) throw createError({ statusCode: 401, statusMessage: "Unauthorized" })

  const body = await readBody(event)
  const { entertainment } = body as {
    entertainment: string
  }
  if (!entertainment) throw createError({ statusCode: 400, statusMessage: "Bad request" })

  const user = event.context.user
  if (!user.reviews.map((e) => e.toString()).includes(entertainment))
    throw createError({ statusCode: 400, statusMessage: "You haven't reviewed this entertainment" })

  return { status: 200, statusMessage: "Deleted" }
})
