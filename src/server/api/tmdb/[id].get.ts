import { CreditsResult, ErrorResponse, TMDBData } from "~/@types"
import getDataFromTMDB from "~/utils/getDataFromTMDB"

// @ts-ignore
export default defineEventHandler(async (event) => {
  const id = event.context.params?.id as string
  let type = (getQuery(event).type as "movie" | "tv") || null
  if (!id) return { status: 400, message: "Missing id" } as ErrorResponse
  if (!type) type = "movie"

  const data = await getDataFromTMDB(id, type)

  data.credits.cast = data.credits.cast.filter(
    (v, i, a) => a.findIndex((t) => t.id === v.id) === i
  )

  data.credits.crew = data.credits.crew.filter(
    (v, i, a) => a.findIndex((t) => t.id === v.id) === i
  )

  return data as TMDBData
})
