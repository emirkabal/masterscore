import prisma from "~/server/db/prisma"

export default defineEventHandler(async (event) => {
  const data = await prisma.user.findMany({
    take: 40,
    select: {
      username: true,
      avatar: true
    }
  })
  return data
})
