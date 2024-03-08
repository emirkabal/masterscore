import type { TMDBPerson } from "~/types"
import getISO from "~/utils/getISO"
const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, statusMessage: "missing id" })

  const lang = getISO(getCookie(event, "locale"))
  const data = await $fetch<TMDBPerson>(
    `https://api.themoviedb.org/3/person/${id}?api_key=${config.TMDB_API_KEY}&language=${lang}&append_to_response=external_ids,combined_credits`
  ).catch(() => null)

  if (!data || data.adult)
    throw createError({
      statusCode: 404,
      statusMessage: "Person not found or is an adult content"
    })

  return data as TMDBPerson
})
