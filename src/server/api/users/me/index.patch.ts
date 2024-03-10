import { UserPatchableSchema } from "~/server/validation"
import { upload, remove } from "~/utils/fileManager"
import { getBlob } from "~/utils/utils"
import prisma from "~/server/db/prisma"

export default defineEventHandler(async (event) => {
  if (!event.context.user) throw createError({ statusCode: 401, statusMessage: "Unauthorized" })

  const body = await readBody(event)

  const { error } = UserPatchableSchema.validate(body)
  if (error) throw createError({ statusCode: 400, statusMessage: error.message })

  const user = await prisma.user.findUnique({
    where: {
      id: event.context.user.id
    }
  })
  if (!user) throw createError({ statusCode: 404, statusMessage: "User not found" })

  if (user.username_changed_at && body.username) {
    const timeSinceLastChange = new Date().getTime() - user.username_changed_at.getTime()
    if (timeSinceLastChange < 1000 * 60 * 60 * 24 * 7) {
      throw createError({
        statusCode: 400,
        statusMessage: "You can only change your username once a week."
      })
    }
  }

  if (body.username) {
    const usernameExists = await prisma.user.findFirst({
      where: {
        username: {
          equals: body.username,
          mode: "insensitive"
        }
      }
    })

    if (usernameExists) {
      throw createError({
        statusCode: 400,
        statusMessage: "Username is already taken"
      })
    }
  }

  if (body.username) {
    user.username = body.username
    user.username_changed_at = new Date()
  }

  user.about = body.about || null
  user.banner = body.banner || null

  if (typeof body.avatar === "string") {
    if (!body.avatar.length && user.avatar) {
      await remove("avatars/" + user.avatar)
      user.avatar = null
    } else {
      const blob = await getBlob(body.avatar)
      const message = await upload(blob)
      if (message.data) {
        user.avatar = message.data
      } else {
        return message
      }
    }
  }

  await prisma.user.update({
    where: {
      id: user.id
    },
    data: user
  })

  return {
    status: 200,
    message: "User updated successfully",
    data: user
  }
})
