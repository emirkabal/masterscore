import { LRUCache } from "lru-cache"
import { slugify } from "~/lib/utils"
import prisma from "~/server/db/prisma"

type SitemapUrl = {
  loc: string
  lastmod?: Date
}

const cache = new LRUCache({
  max: 1,
  ttl: 1000 * 60 * 60 * 24 * 3
})

export default defineSitemapEventHandler(async () => {
  const cachedUrls = cache.get("sitemap") as SitemapUrl[] | undefined
  if (cachedUrls) {
    return cachedUrls
  }

  const medias = await prisma.media.findMany({
    take: 100000
  })

  const users = await prisma.user.findMany({
    take: 1000
  })

  const urls = [
    ...users.map((user) => {
      return asSitemapUrl({
        loc: `/${user.username}`,
        lastmod: user.updated_at
      })
    }),
    ...medias.map((media) => {
      return asSitemapUrl({
        loc: `/${media.type}/${slugify(media.title)}-${media.tmdb_id}`,
        lastmod: media.updated_at
      })
    })
  ]

  cache.set("sitemap", urls)
  return urls
})
