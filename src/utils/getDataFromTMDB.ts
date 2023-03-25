import { TMDBMovie, TMDBTV } from "~/@types"
import EntertainmentModel from "~/server/models/Entertainment.model"
import { Redis } from "@upstash/redis"

const config = useRuntimeConfig()
const redis = new Redis({
  url: config.UPSTASH_REDIS_REST_URL,
  token: config.UPSTASH_REDIS_REST_TOKEN
})
export default async (
  id: string,
  type: string
): Promise<TMDBMovie | TMDBTV> => {
  const key = `tmdb:${type}:${id}`

  const cached: object | null = await redis.get(key)
  if (cached) return cached as TMDBMovie | TMDBTV
  // @ts-ignore
  const data: TMDBMovie | TMDBTV = await $fetch(
    `https://api.themoviedb.org/3/${type}/${id}?api_key=${config.TMDB_API_KEY}&language=en-US&append_to_response=external_ids`
  )

  let title = "Untitled"
  let date = "0000-00-00"
  let rated = "NR"
  let description = data.overview
  let imdbId = ""
  let runtime = 45
  let ratings = {
    tmdb: data.vote_average || 0
  }
  if ("title" in data && data.title) title = data.title
  if ("name" in data && data.name) title = data.name
  if ("release_date" in data && data.release_date) date = data.release_date
  if ("first_air_date" in data && data.first_air_date)
    date = data.first_air_date

  if ("runtime" in data && data.runtime && data.runtime > 0)
    runtime = data.runtime
  if (
    "episode_run_time" in data &&
    data.episode_run_time &&
    data.episode_run_time.length > 0 &&
    data.episode_run_time[0] > 0
  )
    runtime = data.episode_run_time[0]

  if (data.imdb_id) {
    imdbId = data.imdb_id
    const imdbData: any = await $fetch(
      `https://www.omdbapi.com/?i=${data.imdb_id}&apikey=189867f0`
    ).catch(() => null)
    if (imdbData) {
      if (imdbData.Ratings && imdbData.Ratings.length > 0) {
        const imdbScore = imdbData.Ratings.find(
          (e: any) => e.Source === "Internet Movie Database"
        )
        const rottenTomatoesScore = imdbData.Ratings.find(
          (e: any) => e.Source === "Rotten Tomatoes"
        )
        const metacriticScore = imdbData.Ratings.find(
          (e: any) => e.Source === "Metacritic"
        )

        if (imdbScore)
          ratings = Object.assign(ratings, {
            imdb: Number(imdbScore.Value.replace("/10", ""))
          })
        if (rottenTomatoesScore)
          ratings = Object.assign(ratings, {
            rotten_tomatoes: Number(rottenTomatoesScore.Value.replace("%", ""))
          })
        if (metacriticScore)
          ratings = Object.assign(ratings, {
            metacritic: Number(metacriticScore.Value.replace("/100", ""))
          })
      }
      if (imdbData.Rated) rated = imdbData.Rated
      if (
        !description ||
        description === "" ||
        (description.length < 1 && imdbData.Plot)
      )
        description = imdbData.Plot
    }
  }

  let localDataSet = {
    id: data.id,
    type,
    info: {
      title,
      description,
      poster: data.poster_path,
      backdrop: data.backdrop_path,
      release_date: date,
      rated,
      imdbId,
      runtime,
      ratings: Object.keys(ratings).length > 0 ? ratings : undefined
    }
  }

  const localData = await EntertainmentModel.findOneAndUpdate(
    { id: data.id, type: type },
    {
      $set: localDataSet
    },
    { upsert: true, new: true }
  )

  if (localData._id) data.localId = localData._id.toString()
  data.localData = localData.toJSON()

  await redis.set(key, data, {
    ex: 60 * 60 * 24 * 3 // 3 days
  })

  return data as TMDBMovie | TMDBTV
}
