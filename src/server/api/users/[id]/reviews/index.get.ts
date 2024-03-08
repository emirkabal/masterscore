export default defineEventHandler(async (event) => {
  const { id } = event.context.params as { id: string }
  if (!id) throw createError({ statusCode: 400, statusMessage: "Bad request" })

  return []
})
