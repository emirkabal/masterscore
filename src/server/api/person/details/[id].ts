import { ErrorResponse, ExternalIDs, TMDBData, TMDBPerson } from "~~/src/@types"

const config = useRuntimeConfig()
export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) return { status: 400, message: "Missing id" } as ErrorResponse

  const data: TMDBPerson & ExternalIDs = await $fetch(
    `https://api.themoviedb.org/3/person/${id}?api_key=${config.TMDB_API_KEY}&language=en-US`
  )

  if (!data)
    return { status: 404, message: "Person not found" } as ErrorResponse

  const external: ExternalIDs = await $fetch(
    `https://api.themoviedb.org/3/person/${id}/external_ids?api_key=${config.TMDB_API_KEY}`
  )

  if (external) {
    Object.assign(data, external)
  }

  const credits: { cast: TMDBData[] } = await $fetch(
    `https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${config.TMDB_API_KEY}&language=en-US`
  )

  if (credits) {
    data.credits = credits.cast
      .filter(
        (credit) =>
          credit.backdrop_path &&
          credit.poster_path &&
          "media_type" in credit &&
          ["movie", "tv"].includes(credit.media_type as string)
      )
      .sort((a, b) => {
        if (a.popularity && b.popularity) {
          if (a.popularity > b.popularity) return -1
          else if (a.popularity < b.popularity) return 1
        }
        return 0
      })
  }

  return data as TMDBPerson & ExternalIDs
})
