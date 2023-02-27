import { TMDBMovie } from "~~/src/@types"

export default defineEventHandler(async (event) => {
  const page = Math.floor(Math.random() * 500) + 1
  const data: {
    results: TMDBMovie[]
  } = await $fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=d6026e393eb5243af3cf84211acd46fe&include_adult=false&page=${page}`
  )
  const random = Math.floor(Math.random() * data.results.length)
  const movie = data.results[random]
  return {
    id: movie.id
  }
})
