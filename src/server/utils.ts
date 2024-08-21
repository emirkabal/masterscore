import type { Media, MediaType, OMDBMedia, Scores, TMDBMedia } from "~/types"
import prisma from "./db/prisma"
import { LRUCache } from "lru-cache"
const cache = new LRUCache<string, any>({
  max: 200,
  ttl: import.meta.dev ? 1 : 60 * 60 * 2000
})

export const getUser = (id: string) =>
  prisma.user
    .findUnique({
      where: {
        username: id
      }
    })
    .catch(() => null)

export const getTopMediaByReviewsContent = async () => {
  const cached = cache.get("top-media-by-reviews-content")
  if (cached) return cached

  const raw = await prisma.review.groupBy({
    where: {
      content: {
        not: null
      }
    },
    by: ["media_id"],
    _count: {
      media_id: true
    },
    orderBy: {
      _count: {
        media_id: "desc"
      }
    },
    take: 10
  })

  const medias = await prisma.media.findMany({
    where: {
      id: {
        in: raw.map((r) => r.media_id)
      }
    }
  })

  const topMedia = raw.map((r) => {
    const data = medias.find((media) => media.id === r.media_id)
    return {
      data,
      count: r._count.media_id
    }
  })

  cache.set("top-media-by-reviews-content", topMedia, {
    ttl: 10 * 60 * 1000
  })

  return topMedia
}

export const getTopMediaByLikes = async () => {
  const cached = cache.get("top-media-by-likes")
  if (cached) return cached

  const raw = await prisma.like.groupBy({
    by: ["media_id"],
    _count: {
      media_id: true
    },
    orderBy: {
      _count: {
        media_id: "desc"
      }
    },
    take: 10
  })

  const medias = await prisma.media.findMany({
    where: {
      id: {
        in: raw.map((r) => r.media_id)
      }
    }
  })

  const topMedia = raw.map((r) => {
    const data = medias.find((media) => media.id === r.media_id)
    return {
      data,
      count: r._count.media_id
    }
  })

  cache.set("top-media-by-likes", topMedia, {
    ttl: 10 * 60 * 1000
  })

  return topMedia
}

export const getTopMediaByReviews = async ({
  limit,
  type,
  disableReviewRequirement
}: {
  limit?: number
  type?: string
  disableReviewRequirement?: boolean
}) => {
  const key = `top-media-by-reviews:${type}:${limit}:${disableReviewRequirement}`

  const cached = cache.get(key)
  if (cached) return cached

  const raw = await prisma.review.groupBy({
    by: ["media_id"],
    _avg: { rating: true },
    _count: true,
    having: {
      rating: {
        _count: {
          gte: disableReviewRequirement ? 0 : 3
        }
      }
    },
    orderBy: {
      _avg: {
        rating: "desc"
      }
    },
    where: {
      ...(type
        ? {
            media: {
              type: type
            }
          }
        : {}),
      user: {
        suspended: false
      }
    },
    take: limit ? Math.min(limit, 100) : 20
  })

  const reviews = await prisma.review.findMany({
    where: {
      media_id: {
        in: raw.map((r) => r.media_id)
      }
    },
    include: {
      media: true
    }
  })

  const topMedia = raw.map((r) => {
    const review = reviews.find((review) => review.media_id === r.media_id)
    return {
      media: review?.media,
      score: r._avg.rating,
      count: r._count
    }
  })

  cache.set(key, topMedia, {
    ttl: 10 * 60 * 1000
  })

  return topMedia
}

export const getMostReviewedUsers = async ({ comment }: { comment?: boolean }) => {
  const key = `most-reviewed-users:${comment}`

  const cached = cache.get(key)
  if (cached) return cached

  const raw = await prisma.review.groupBy({
    by: ["user_id"],
    where: {
      user: {
        suspended: false
      },
      ...(comment === true
        ? {
            content: {
              not: null
            }
          }
        : {})
    },
    _count: {
      id: true
    },
    orderBy: {
      _count: {
        id: "desc"
      }
    },
    take: 20
  })

  const users = await prisma.user.findMany({
    where: {
      id: {
        in: raw.map((r) => r.user_id)
      }
    },
    select: {
      id: true,
      username: true,
      verified: true,
      flags: true,
      suspended: true,
      display_name: true,
      avatar: true
    }
  })

  const topUsers = raw.map((r) => {
    const data = users.find((user) => user.id === r.user_id)
    return {
      data,
      count: r._count.id
    }
  })

  cache.set(key, topUsers, {
    ttl: 10 * 60 * 1000
  })

  return topUsers
}

export const getMostLikedUsers = async () => {
  const cached = cache.get("most-liked-users")
  if (cached) return cached

  const raw = await prisma.like.groupBy({
    by: ["user_id"],
    _count: {
      id: true
    },
    orderBy: {
      _count: {
        id: "desc"
      }
    },
    where: {
      user: {
        suspended: false
      }
    },
    take: 20
  })

  const users = await prisma.user.findMany({
    where: {
      id: {
        in: raw.map((r) => r.user_id)
      }
    },
    select: {
      id: true,
      username: true,
      verified: true,
      flags: true,
      suspended: true,
      display_name: true,
      avatar: true
    }
  })

  const topUsers = raw.map((r) => {
    const data = users.find((user) => user.id === r.user_id)
    return {
      data,
      count: r._count.id
    }
  })

  cache.set("most-liked-users", topUsers, {
    ttl: 10 * 60 * 1000
  })

  return topUsers
}

export const getBlob = async (url: string) => {
  const response = await fetch(url)
  return await response.blob()
}

export const isBannedUsername = (username: string) => {
  return [
    "admin",
    "moderator",
    "administrator",
    "owner",
    "feed",
    "discover",
    "settings",
    "table",
    "whoweare",
    "about",
    "terms",
    "privacy",
    "tos",
    "contact",
    "dmca",
    "support",
    "help",
    "faq",
    "master",
    "masterscore",
    "emirkabal",
    "cookie"
  ].includes(username.toLowerCase())
}

export const randomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min)

export async function getSyncedMedia(tmdb_id: number, type: MediaType) {
  const config = useRuntimeConfig()

  const cached = await cache.get(`${config.VERSION}:${type}:${tmdb_id}`)
  if (cached) return cached as Media & { _count: { likes: number; reviews: number } }

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
    `https://www.omdbapi.com/?i=${tmdb.external_ids?.imdb_id}&apikey=189867f0`
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
    imdb_id: tmdb?.external_ids?.imdb_id,
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
              display_name: true,
              username: true,
              avatar: true
            }
          }
        }
      }
    }
  })

  await cache.set(`${config.VERSION}:${type}:${tmdb_id}`, media)

  return media
}
