import { ErrorResponse, ExternalIDs, TMDBData, TMDBPerson } from "~/@types"

const config = useRuntimeConfig()
export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) return { status: 400, message: "Missing id" } as ErrorResponse
  const lang = getCookie(event, "locale") || "en-US"
  const data: TMDBPerson &
    ExternalIDs & {
      combined_credits: { cast: TMDBData[]; crew: TMDBData[] }
      external_ids: ExternalIDs
    } = await $fetch(
    `https://api.themoviedb.org/3/person/${id}?api_key=${config.TMDB_API_KEY}&language=${lang}&append_to_response=external_ids,combined_credits`
  )

  if (!data)
    return { status: 404, message: "Person not found" } as ErrorResponse

  if (data.external_ids) Object.assign(data, data.external_ids)

  if (data.combined_credits)
    data.credits = data.combined_credits.cast
      .filter(
        (credit) =>
          "media_type" in credit &&
          ["movie", "tv"].includes(credit.media_type as string)
      )
      .sort((a, b) => {
        if (a.popularity && b.popularity) {
          if (a.popularity > b.popularity) return -1
          else if (a.popularity < b.popularity) return 1
        }
        return 1
      })
      // remove duplicates
      .filter((credit, index, self) => {
        return (
          index ===
          self.findIndex(
            (c) =>
              c.id === credit.id &&
              "media_type" in c &&
              "media_type" in credit &&
              c.media_type === credit.media_type
          )
        )
      })

  return data as TMDBPerson & ExternalIDs
})
