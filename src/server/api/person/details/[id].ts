import { ErrorResponse, TMDBPerson } from "~~/src/@types"

const config = useRuntimeConfig()
export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) return { status: 400, message: "Missing id" } as ErrorResponse

  const data = await $fetch(
    `https://api.themoviedb.org/3/person/${id}?api_key=${config.TMDB_API_KEY}&language=en-US`
  )
  if (!data)
    return { status: 404, message: "Person not found" } as ErrorResponse

  return data as TMDBPerson
})
