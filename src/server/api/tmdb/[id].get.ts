import { ErrorResponse, TMDBData } from "~/@types"
import getDataFromTMDB from "~/utils/getDataFromTMDB"
import getISO from "~/utils/getISO"

// @ts-ignore
export default defineEventHandler(async (event) => {
  const id = event.context.params?.id as string
  let type = (getQuery(event).type as "movie" | "tv") || null
  if (!id)
    return createError({
      statusCode: 400,
      message: "Entertainment not found or is an adult content"
    })
  if (!type) type = "movie"

  const lang = getISO(getCookie(event, "locale"))
  const data = await getDataFromTMDB(id, type, lang)
  if (!data)
    return createError({
      statusCode: 404,
      message: "Entertainment not found or is an adult content"
    })

  data.credits.cast = data.credits.cast.filter(
    (v, i, a) => a.findIndex((t) => t.id === v.id) === i
  )

  return data as TMDBData
})
