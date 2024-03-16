import prisma from "~/server/db/prisma"

export default defineEventHandler(async (event) => {
  const data = await prisma.user.findMany({
    where: {
      suspended: false
    },
    select: {
      username: true,
      avatar: true
    },
    orderBy: {
      created_at: "desc"
    },
    take: 20
  })
  return data
})
