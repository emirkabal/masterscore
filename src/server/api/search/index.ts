import getISO from "~/utils/getISO"
import prisma from "../../db/prisma"
import type { TMDBResult, TMDBSearchResults } from "~/types"
const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const { q, limit: queryLimit } = getQuery(event)

  const limit = Math.min(parseInt(queryLimit as string), 3) || 3

  const lang = getISO(getCookie(event, "locale"))
  const data = await $fetch<TMDBSearchResults<TMDBResult>>(
    `https://api.themoviedb.org/3/search/multi?api_key=${config.TMDB_API_KEY}&language=${lang}&page=1&include_adult=false&query=${q}`
  )

  const results = data.results
    .filter(
      (result) =>
        ["movie", "tv"].includes(result.media_type) &&
        (result.release_date || result.first_air_date)
    )
    .slice(0, limit)

  const persons = data.results
    .filter((result) => result.media_type === "person" && result.profile_path)
    .slice(0, 3)

  const users = await prisma.user.findMany({
    where: {
      suspended: false,
      OR: [
        { username: { contains: q?.toString(), mode: "insensitive" } },
        { display_name: { contains: q?.toString(), mode: "insensitive" } }
      ]
    },
    select: {
      display_name: true,
      username: true,
      avatar: true,
      verified: true,
      flags: true
    },
    take: 3
  })

  return {
    status: 200,
    tmdb: results,
    persons: persons,
    users: users
  }
})
