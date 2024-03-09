import type { Media, MediaType, OMDBMedia, Scores, TMDBMedia } from "~/types"
import prisma from "~/server/db/prisma"
import redis from "~/utils/redis"

export const getBlob = async (url: string) => {
  const response = await fetch(url)
  return await response.blob()
}

export async function getSyncedMedia(tmdb_id: number, type: MediaType) {
  const config = useRuntimeConfig()

  const cache = await redis.get(`${config.VERSION}:${type}:${tmdb_id}`)
  // if (cache) return cache as Media & { _count: { likes: number; reviews: number } }

  const tmdb = await $fetch<TMDBMedia>(`https://api.themoviedb.org/3/${type}/${tmdb_id}`, {
    params: {
      append_to_response: "external_ids,images",
      include_image_language: "en"
    },
    headers: {
      Authorization: `Bearer ${config.public.TMDB_API_TOKEN}`
    }
  }).catch(() => null)

  if (!tmdb || tmdb.adult) return null

  const scores: Scores = {
    tmdb: tmdb.vote_average || 0
  }

  const images = {
    poster: tmdb.poster_path,
    backdrop: tmdb.backdrop_path,
    logo: tmdb.images?.logos?.[0]?.file_path
  }

  const omdb = await $fetch<OMDBMedia>(
    `https://www.omdbapi.com/?i=${tmdb.external_ids.imdb_id}&apikey=189867f0`
  ).catch(() => null)

  if (omdb?.Ratings?.length) {
    omdb.Ratings.forEach((r) => {
      if (r.Source === "Internet Movie Database")
        scores.imdb = parseFloat(r.Value.replace("/10", ""))
      if (r.Source === "Rotten Tomatoes")
        scores.rotten_tomatoes = parseFloat(r.Value.replace("%", ""))
      if (r.Source === "Metacritic") scores.metacritic = parseFloat(r.Value.replace("/100", ""))
    })
  }

  const data = {
    title: tmdb.title || tmdb.name,
    description: tmdb.overview,
    images,
    release_date: tmdb.release_date || tmdb.first_air_date || "N/A",
    imdb_id: tmdb.external_ids.imdb_id,
    rated: omdb?.Rated || "N/A",
    runtime: tmdb.runtime || tmdb.episode_run_time?.[0] || 0,
    scores
  }

  const media = await prisma.media.upsert({
    where: {
      tmdb_id_type: {
        tmdb_id,
        type
      }
    },
    update: {
      ...data
    },
    create: {
      tmdb_id,
      type,
      ...data
    },
    include: {
      _count: {
        select: {
          likes: true,
          reviews: true
        }
      },
      likes: {
        take: 3,
        select: {
          user: {
            select: {
              username: true,
              avatar: true
            }
          }
        }
      }
    }
  })

  await redis.set(`${config.VERSION}:${type}:${tmdb_id}`, media, {
    ex: 60 * 60 * 24
  })

  return media
}
