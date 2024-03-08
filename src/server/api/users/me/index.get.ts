import type { User } from "~/types"

export default defineEventHandler(async (event) => {
  if (!event.context.user) throw createError({ statusCode: 401, statusMessage: "Unauthorized" })

  return event.context.user
})
