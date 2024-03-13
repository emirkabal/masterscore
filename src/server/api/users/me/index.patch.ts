import { UserPatchableSchema } from "~/utils/validation"
import { upload, remove } from "~/utils/fileManager"
import { getBlob, isBannedUsername } from "~/server/utils"
import prisma from "~/server/db/prisma"

export default defineEventHandler(async (event) => {
  if (!event.context.user) throw createError({ statusCode: 401, statusMessage: "Unauthorized" })

  const body = await readValidatedBody(event, UserPatchableSchema.parse)

  const user = await prisma.user.findUnique({
    where: {
      id: event.context.user.id
    }
  })
  if (!user) throw createError({ statusCode: 404, statusMessage: "User not found" })

  if (body.username && body.username !== user.username) {
    if (user.username_changed_at) {
      const timeSinceLastChange = new Date().getTime() - user.username_changed_at.getTime()
      if (timeSinceLastChange < 1000 * 60 * 60 * 24 * 7)
        throw createError({
          statusCode: 400,
          statusMessage: "You can only change your username once a week."
        })
    }

    if (isBannedUsername(body.username))
      throw createError({
        statusCode: 400,
        statusMessage: "Username is not allowed."
      })

    const usernameExists = await prisma.user.findFirst({
      where: {
        username: {
          equals: body.username,
          mode: "insensitive"
        }
      }
    })

    if (usernameExists)
      throw createError({
        statusCode: 400,
        statusMessage: "Username already taken."
      })

    user.username = body.username.toLowerCase()
    user.username_changed_at = new Date()
  }

  user.display_name = body.display_name || null
  user.about = body.about || null

  if (typeof body.avatar === "string" && body.avatar !== user.avatar) {
    if (!body.avatar.length && user.avatar) {
      await remove("avatars/" + user.avatar)
      user.avatar = null
    } else {
      if (user.avatar) await remove("avatars/" + user.avatar)
      const blob = await getBlob(body.avatar)
      const message = await upload("avatars", blob)
      if (message.data) {
        user.avatar = message.data
      } else {
        return message
      }
    }
  }

  if (typeof body.banner === "string" && body.banner !== user.banner) {
    if (!body.banner.length && user.banner) {
      await remove("banners/" + user.banner)
      user.banner = null
    } else {
      if (user.banner) await remove("banners/" + user.banner)
      const blob = await getBlob(body.banner)
      const message = await upload("banners", blob)
      if (message.data) {
        user.banner = message.data
      } else {
        return message
      }
    }
  }

  await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      display_name: user.display_name,
      username: user.username,
      about: user.about,
      avatar: user.avatar,
      banner: user.banner,
      username_changed_at: user.username_changed_at
    }
  })

  const { password, revision, ...userWithoutPassword } = user

  return {
    status: 200,
    message: "User updated successfully",
    data: userWithoutPassword
  }
})
