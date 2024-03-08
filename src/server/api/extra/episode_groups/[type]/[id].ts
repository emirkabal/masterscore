import type { EpisodeGroups, EpisodeGroupsDetails } from "~/types"
import getISO from "~/utils/getISO"

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const { type, id } = event.context.params as {
    type: "groups" | "details"
    id: string
  }
  const lang = getISO(getCookie(event, "locale"))

  if (type === "groups") {
    const data = await $fetch<EpisodeGroups>(
      `https://api.themoviedb.org/3/tv/${id}/episode_groups?api_key=${config.TMDB_API_KEY}&language=${lang}`
    )

    return data
  } else if (type === "details") {
    const data = await $fetch<EpisodeGroupsDetails>(
      `https://api.themoviedb.org/3/tv/episode_group/${id}?api_key=${config.TMDB_API_KEY}&language=${lang}`
    )

    return data
  } else {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid type"
    })
  }
})
