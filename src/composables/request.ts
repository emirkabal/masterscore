import type {
  APIUser,
  CollapsedMedia,
  Media,
  MediaType,
  TMDBMedia,
  TMDBPerson,
  User
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
          append_to_response: "external_ids,videos,credits,similar"
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
