import { TMDBMovie } from "~/@types"
const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const page = Math.floor(Math.random() * 100) + 1
  const data: {
    results: TMDBMovie[]
  } = await $fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${config.TMDB_API_KEY}&include_adult=false&page=${page}`
  )
  const random = Math.floor(Math.random() * data.results.length)
  const movie = data.results[random]
  return {
    id: movie.id
  }
})
