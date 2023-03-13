import { ErrorResponse, IUser, TMDBSearchResult } from "~/@types"
import UserModel from "~/server/models/User.model"

const config = useRuntimeConfig()
export default defineEventHandler(async (event) => {
  const { q } = getQuery(event)
  if (!q) {
    return { status: 400, message: "Missing query" } as ErrorResponse
  }

  const data: {
    results: TMDBSearchResult[]
    // @ts-ignore
  } = await $fetch(
    `https://api.themoviedb.org/3/search/multi?api_key=${config.TMDB_API_KEY}&language=en-US&page=1&include_adult=false&query=${q}`
  )

  const results = data.results
    .filter(
      (result) =>
        ["movie", "tv"].includes(result.media_type) &&
        result.backdrop_path &&
        result.poster_path
    )
    .slice(0, 5)

  const persons = data.results
    // @ts-ignore
    .filter((result) => result.media_type === "person" && result.profile_path)
    .slice(0, 3)

  const users: IUser[] = await UserModel.find({
    $or: [{ username: { $regex: q, $options: "i" } }]
  })
    .limit(3)
    .select("username")
    .lean()

  return {
    status: 200,
    tmdb: results,
    persons: persons,
    users: users.map((user) => user.username)
  }
})
