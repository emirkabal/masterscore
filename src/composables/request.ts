import type {
  APISummary,
  APIUser,
  CollapsedMedia,
  Media,
  MediaType,
  Review,
  TMDBCollectionDetails,
  TMDBMedia,
  TMDBPerson,
  TMDBResult,
  TMDBSearchResults
} from "~/types"
import { LRUCache } from "lru-cache"
import getISO from "~/utils/getISO"

const cache = new LRUCache<string, any>({
  max: 200,
  ttl: 60 * 60 * 2000
})

function _tmdb(url: string, params: Record<string, string | number | boolean | undefined> = {}) {
  return new Promise(async (resolve, reject) => {
    const config = useRuntimeConfig()

    const locale = await useCookie("locale")
    if (locale.value && !params.language) params.language = getISO(locale.value)

    $fetch(url, {
      baseURL: "https://api.themoviedb.org/3",
      params,
      headers: {
        Authorization: `Bearer ${config.public.TMDB_API_TOKEN}`
      }
    })
      .then(resolve)
      .catch(reject)
  })
}

export function getMedia(type: MediaType, id: string | number) {
  const key = `${type}:${id}`
  const cached = cache.get(key)
  if (cached) return Promise.resolve(cached as CollapsedMedia)

  return new Promise<CollapsedMedia | null>(async (resolve, reject) => {
    try {
      const [media, tmdb] = await Promise.all([
        $fetch<
          Media & {
            _count: {
              likes: number
              reviews: number
            }
            score: number
          }
        >(`/api/media/${id}/sync?type=${type}`),
        _tmdb(`/${type}/${id}`, {
          append_to_response: "external_ids,videos,credits,recommendations"
        }) as Promise<TMDBMedia>
      ])

      cache.set(key, {
        media,
        ...tmdb
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

export const getPerson = async (id: string | number) => {
  const key = `person:${id}`
  const cached = cache.get(key)

  if (cached) return Promise.resolve(cached as TMDBPerson)

  return new Promise<TMDBPerson>(async (resolve, reject) => {
    try {
      const person = (await _tmdb(`/person/${id}`, {
        append_to_response: "external_ids,combined_credits"
      })) as TMDBPerson

      cache.set(key, person)
      resolve(person)
    } catch (e) {
      reject(e)
    }
  })
}

export const getDiscover = async (
  type: MediaType,
  options: {
    with_genres?: string
    without_genres?: string
    with_keywords?: string
    without_keywords?: string
    sort_by?: "popularity.desc" | "release_date.desc" | "vote_average.desc"
    page?: number | string
  }
) => {
  const key = `discover:${type}:${JSON.stringify(options)}`
  const cached = cache.get(key)
  if (cached) return Promise.resolve(cached as TMDBSearchResults<TMDBResult>)

  if (!options.page) options.page = "1"
  if (!options.sort_by) options.sort_by = "popularity.desc"

  return new Promise<TMDBSearchResults<TMDBResult>>(async (resolve, reject) => {
    try {
      const data = (await _tmdb(`/discover/${type}`, {
        include_adult: "false",
        include_video: "false",
        without_keywords: "210024",
        ...options
      })) as TMDBSearchResults<TMDBResult>

      cache.set(key, data)

      resolve(data)
    } catch (e) {
      reject(e)
    }
  })
}

export const getCollection = async (id: string | number) => {
  const key = `collection:${id}`
  const cached = cache.get(key)

  if (cached) return Promise.resolve(cached as TMDBCollectionDetails)

  return new Promise<TMDBCollectionDetails>(async (resolve, reject) => {
    try {
      const collection = (await _tmdb(`/collection/${id}`)) as TMDBCollectionDetails
      cache.set(key, collection)
      resolve(collection)
    } catch (e) {
      reject(e)
    }
  })
}

export const getHome = async () => {
  const key = `home`
  const cached = cache.get(key)

  if (cached) return Promise.resolve(cached as { trending: TMDBResult[]; top_rated: Review[] })

  return new Promise<{ trending: TMDBResult[]; top_rated: Review[] }>(async (resolve, reject) => {
    try {
      const data = await $fetch<{ trending: TMDBResult[]; top_rated: Review[] }>("/api/extra/home")
      cache.set(key, data)
      resolve(data)
    } catch (e) {
      reject(e)
    }
  })
}

export const getUser = async (username: string) => {
  const key = `user:${username}`
  const cached = cache.get(key)

  if (cached) return Promise.resolve(cached as APIUser)

  return new Promise<APIUser>(async (resolve, reject) => {
    try {
      const user = await $fetch<APIUser>(`/api/users/${username}`)
      cache.set(key, user)
      resolve(user)
    } catch (e) {
      reject(e)
    }
  })
}

export const getUserSummary = async (username: string) => {
  const key = `usersum:${username}`
  const cached = cache.get(key)

  if (cached) return Promise.resolve(cached as APISummary)

  return new Promise<APISummary>(async (resolve, reject) => {
    try {
      const user = await $fetch<APISummary>(`/api/users/${username}/summary`)
      cache.set(key, user)
      resolve(user)
    } catch (e) {
      reject(e)
    }
  })
}
