import type { TMDBData } from "~/types"
import EntertainmentModel from "~/server/models/Entertainment.model"
import redis from "~/utils/redis"
const config = useRuntimeConfig()

export default async (id: string, type: string, lang: string): Promise<TMDBData | null> => {
  const key = `m:${type}:${id}`

  // @ts-ignore
  const data: TMDBData = await $fetch(
    `https://api.themoviedb.org/3/${type}/${id}?api_key=${config.TMDB_API_KEY}&language=${lang}&append_to_response=external_ids,videos,credits,similar,alternative_titles`
  ).catch(() => null)

  if (!data || data.adult) return null

  const cached = await redis.get(key)
  if (cached) return { ...data, ...cached } as TMDBData

  let localData = await EntertainmentModel.findOne({ id: data.id, type: type })
  if (
    localData &&
    localData._id &&
    localData.updatedAt > new Date(Date.now() - 1000 * 60 * 60 * 24 * 3)
  ) {
    data.localId = localData._id.toString()
    data.localData = localData.toJSON()
    await redis.set(
      key,
      {
        localId: data.localId,
        localData: data.localData
      },
      {
        ex: 60 * 60 * 24 * 3
      }
    )
    return data
  }

  let title = "Untitled"
  let date = "0000-00-00"
  let rated = "NR"
  let description = data.overview
  let imdbId = ""
  let runtime = 45
  let ratings = {
    tmdb: data.vote_average || 0
  }
  if ("original_name" in data && data.original_name) title = data.original_name
  if ("original_title" in data && data.original_title) title = data.original_title
  if ("name" in data && data.name) title = data.name
  if ("release_date" in data && data.release_date) date = data.release_date
  if ("first_air_date" in data && data.first_air_date) date = data.first_air_date

  // @ts-ignore
  if (data.alternative_titles.results) data.alternative_titles = data.alternative_titles.results

  // @ts-ignore
  if (data.alternative_titles.titles) data.alternative_titles = data.alternative_titles.titles

  if (
    (("original_title" in data && data.original_title) ||
      ("original_name" in data && data.original_name)) &&
    data?.original_language !== "en" &&
    data?.alternative_titles?.length
  ) {
    const englishName =
      data.alternative_titles.find((e) => e.iso_3166_1 === "US") ||
      data.alternative_titles.find((e) => e.iso_3166_1 === "GB") ||
      data.alternative_titles.find((e) => /^[a-z][a-z0-9]*$/i.test(e.title))
    if (englishName && englishName?.title?.length > 0) title = englishName.title
    switch (data.original_language) {
      case "ja":
        const romaji = data.alternative_titles
          .filter((e) => e.type.length > 0)
          .find((e) => e.iso_3166_1 === "JP" && e.type.toLowerCase().search("romaji|hepburn") > -1)
        if (romaji && romaji.title?.length) title = romaji.title
        break
      case "ko":
        const korean = data.alternative_titles.find(
          (e) => e.iso_3166_1 === "KR" && ["Daum Movie", "Romanized"].includes(e.type)
        )
        if (korean && korean?.title?.length > 0) title = korean.title
        break
    }
  }

  if ("runtime" in data && data.runtime && data.runtime > 0) runtime = data.runtime
  if (
    "episode_run_time" in data &&
    data.episode_run_time &&
    data.episode_run_time.length > 0 &&
    data.episode_run_time[0] > 0
  )
    runtime = data.episode_run_time[0]

  if (data.external_ids) {
    Object.assign(data, data.external_ids)
    delete data.external_ids
  }

  if (data.imdb_id) {
    imdbId = data.imdb_id
    const imdbData: any = await $fetch(
      `https://www.omdbapi.com/?i=${data.imdb_id}&apikey=189867f0`
    ).catch(() => null)
    if (imdbData) {
      if (imdbData.Ratings && imdbData.Ratings.length > 0) {
        const imdbScore = imdbData.Ratings.find((e: any) => e.Source === "Internet Movie Database")
        const rottenTomatoesScore = imdbData.Ratings.find(
          (e: any) => e.Source === "Rotten Tomatoes"
        )
        const metacriticScore = imdbData.Ratings.find((e: any) => e.Source === "Metacritic")

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
      if (!description || description === "" || (description.length < 1 && imdbData.Plot))
        description = imdbData.Plot
    }
  }

  let localDataSet = {
    id: data.id,
    type,
    info: {
      title,
      poster: data.poster_path,
      backdrop: data.backdrop_path,
      release_date: date,
      rated,
      imdbId,
      runtime,
      ratings: Object.keys(ratings).length > 0 ? ratings : undefined
    }
  }

  localData = await EntertainmentModel.findOneAndUpdate(
    { id: data.id, type: type },
    {
      $set: localDataSet
    },
    { upsert: true, new: true }
  )

  if (localData && localData._id) {
    data.localId = localData._id.toString()
    data.localData = localData.toJSON()
  }

  // await redis.set(key, data, {
  //   ex: 60 * 60 * 24 * 3 // 3 days
  // })

  return data as TMDBData
}
