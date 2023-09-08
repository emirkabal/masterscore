import { EpisodeGroups, EpisodeGroupsDetails } from "~/@types"

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const { type, id } = event.context.params as {
    type: "groups" | "details"
    id: string
  }
  const lang = getCookie(event, "locale") || "en-US"

  if (type === "groups") {
    const data: EpisodeGroups = await $fetch(
      `https://api.themoviedb.org/3/tv/${id}/episode_groups?api_key=${config.TMDB_API_KEY}&language=${lang}`
    )

    return data
  } else if (type === "details") {
    const data: EpisodeGroupsDetails = await $fetch(
      `https://api.themoviedb.org/3/tv/episode_group/${id}?api_key=${config.TMDB_API_KEY}&language=${lang}`
    )

    return data
  } else {
    return createError({
      statusCode: 400,
      message: "Invalid type"
    })
  }
})
