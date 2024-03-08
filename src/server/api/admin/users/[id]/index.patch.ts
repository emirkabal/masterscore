import prisma from "~/server/db/prisma"

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized"
    })
  }

  if (event.context.user.id?.toString() !== "63f4dcf150582a1ca831f639")
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden"
    })

  const id = event.context.params?.id as string

  const body: {
    verified?: boolean
  } = await readBody(event)

  const user = await prisma.user.findUnique({
    where: {
      id
    }
  })

  if (!user) throw createError({ statusCode: 404, statusMessage: "User not found" })

  if (body.verified !== undefined) {
    user.verified = body.verified
    if (user.verified) user.verified_at = new Date()
    else user.verified_at = null
  }

  await prisma.user.update({
    where: {
      id
    },
    data: {
      verified: user.verified,
      verified_at: user.verified_at
    }
  })

  return {
    status: 200,
    message: "User updated successfully",
    data: user
  }
})
