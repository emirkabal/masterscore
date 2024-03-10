import prisma from "./db/prisma"

export const getUser = (id: string) =>
  prisma.user
    .findUnique({
      where: {
        username: id
      }
    })
    .catch(() => null)
