import jwt from "jsonwebtoken"
import prisma from "../db/prisma"
const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  if (event.node.req.headers.authorization) {
    const token = event.node.req.headers.authorization.split(" ")[1]
    const decoded = jwt.decode(token) as { id: string; revision: number } | null
    if (decoded) {
      const user = await prisma.user
        .findUnique({
          where: {
            id: decoded.id
          }
        })
        .catch(() => null)
      if (user) {
        if (user.revision !== decoded.revision)
          throw createError({ statusCode: 401, statusMessage: "Unauthorized" })
        const secret = config.JWT_SECRET
        try {
          const valid = jwt.verify(token, secret)
          if (valid) {
            const { password, ...passwordLess } = user
            // @ts-ignore
            event.context.user = passwordLess
          }
        } catch (e) {}
      }
    }
  }
})
