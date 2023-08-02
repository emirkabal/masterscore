const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const { series_id, season_number } = event.context.params as {
    series_id: string
    season_number: string
  }
  if (isNaN(Number(series_id)) || isNaN(Number(season_number)))
    return createError({
      statusCode: 400,
      message: "Invalid series_id or season_number"
    })
  const data: any = await $fetch(
    `https://api.themoviedb.org/3/tv/${series_id}/season/${season_number}?api_key=${config.TMDB_API_KEY}`
  )

  return data
})
