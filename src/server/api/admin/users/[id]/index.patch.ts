import { z } from "zod"
import prisma from "~/server/db/prisma"

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized"
    })
  }

  if (user.id !== "63f4dcf150582a1ca831f639")
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden"
    })

  const id = event.context.params?.id as string

  const body = await readValidatedBody(
    event,
    z.object({
      verified: z.boolean().optional(),
      suspended: z.boolean().optional()
    }).parse
  )

  const target = await prisma.user.findUnique({
    where: {
      username: id
    }
  })

  if (!target) throw createError({ statusCode: 404, statusMessage: "User not found" })

  if (typeof body.verified !== "undefined") {
    target.verified = body.verified
    target.verified_at = target.verified ? new Date() : null
  }

  if (typeof body.suspended !== "undefined") target.suspended = body.suspended

  await prisma.user.update({
    where: {
      username: id
    },
    data: {
      suspended: target.suspended,
      verified: target.verified,
      verified_at: target.verified_at
    }
  })

  return {
    status: 200,
    message: "User updated successfully",
    data: user
  }
})
