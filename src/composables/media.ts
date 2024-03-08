import type { CollapsedMedia, Media, MediaType, TMDBMedia } from "~/types"
import getISO from "~/utils/getISO"

async function _tmdb(
  url: string,
  params: Record<string, string | number | boolean | undefined> = {}
) {
  const config = useRuntimeConfig()

  const locale = await useCookie("locale")
  if (locale.value && !params.language) params.language = getISO(locale.value)

  return await $fetch<TMDBMedia>(url, {
    baseURL: "https://api.themoviedb.org/3",
    params,
    headers: {
      Authorization: `Bearer ${config.public.TMDB_API_TOKEN}`
    }
  })
}

export function getMedia(type: MediaType, id: string | number) {
  return new Promise<CollapsedMedia | null>(async (resolve, reject) => {
    try {
      const media = await $fetch<
        Media & {
          _count: {
            likes: number
            reviews: number
          }
          score: number
        }
      >(`/api/sync/${id}?type=${type}`)

      const tmdb = await _tmdb(`/${type}/${id}`, {
        append_to_response: "external_ids,videos,images,credits,similar",
        include_image_language: "en"
      })

      resolve({
        media,
        ...tmdb
      })
    } catch (e) {
      reject(e)
    }
  })
}
