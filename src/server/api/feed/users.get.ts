import prisma from "~/server/db/prisma"

export default defineEventHandler(async (event) => {
  const data = await prisma.user.findMany({
    take: 20,
    select: {
      username: true,
      avatar: true
    },
    orderBy: {
      created_at: "desc"
    }
  })
  return data
})
