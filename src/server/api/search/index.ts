import type { ErrorResponse, IUser, TMDBSearchResult } from "~/types"
import UserModel from "~/server/models/User.model"
import getISO from "~/utils/getISO"
const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const { q, limit: queryLimit } = getQuery(event)

  const limit = isNaN(queryLimit as any)
    ? 5
    : parseInt(queryLimit as any) > 20
    ? 20
    : parseInt(queryLimit as any)

  const lang = getISO(getCookie(event, "locale"))
  const data: {
    results: TMDBSearchResult[]
    // @ts-ignore
  } = await $fetch(
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
    // @ts-ignore
    .filter((result) => result.media_type === "person" && result.profile_path)
    .slice(0, 3)

  const users: IUser[] = await UserModel.find({
    $or: [{ username: { $regex: q, $options: "i" } }]
  })
    .limit(3)
    .select("username avatar -_id")
    .lean()

  return {
    status: 200,
    tmdb: results,
    persons: persons,
    users: users
  }
})
