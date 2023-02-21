import { ErrorResponse } from "~~/@types"
import getDataFromTMDB from "~~/utils/getDataFromTMDB"

// @ts-ignore
export default defineEventHandler(async (event) => {
  const id = event.context.params?.id as string
  let type = (getQuery(event).type as "movie" | "tv") || null
  if (!id) return { status: 400, message: "Missing id" } as ErrorResponse
  if (!type) type = "movie"

  const data = await getDataFromTMDB(id, type)
  return data
})
