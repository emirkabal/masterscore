import { slugify } from "~/lib/utils"
import prisma from "~/server/db/prisma"

export default defineSitemapEventHandler(async () => {
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

  return urls
})
