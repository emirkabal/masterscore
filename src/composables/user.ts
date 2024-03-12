import { useUserStore } from "~/store/user"

export const generateHeaders = (headers?: Record<string, string>) => {
  if (!process.client) return {}

  if (!headers) {
    headers = {}
  }
  const token = localStorage.getItem("token")
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }
  return headers
}

export const hasToken = () => {
  if (!process.client) return false
  return !!localStorage.getItem("token")
}

export const patchUser = async (context: {
  display_name?: string
  username?: string
  about?: string
  avatar?: string
  banner?: string
}) => {
  const userStore = useUserStore()
  const res = await $fetch("/api/users/me", {
    method: "patch",
    headers: generateHeaders(),
    body: JSON.stringify(context)
  })
  if (typeof res.data === "object") {
    // @ts-ignore
    userStore.user = { ...userStore.user, ...res.data }
  }
}

export const likeMedia = async (mediaId: string) => {
  const { user, isLiked } = useUserStore()
  if (!user) return useRouter().push("/account/login?r=" + encodeURIComponent(useRoute().fullPath))

  const liked = isLiked(mediaId)

  if (liked) user.likes = user.likes.filter((id) => id !== mediaId)
  else user.likes.push(mediaId)

  const data = await $fetch(`/api/media/${mediaId}/like/${liked ? "unlike" : "like"}`, {
    method: "patch",
    headers: generateHeaders()
  })

  return data
}

export const reviewMedia = async (
  mediaId: string,
  context: {
    rating: number
    content?: string
    spoiler?: boolean
  }
) => {
  const { user } = useUserStore()
  if (!user) return useRouter().push("/account/login?r=" + encodeURIComponent(useRoute().fullPath))

  const { rating, content, spoiler } = context
  const data = await $fetch(`/api/media/${mediaId}/reviews`, {
    method: "post",
    headers: generateHeaders(),
    body: JSON.stringify({ rating, content, spoiler })
  })

  return data
}

export const deleteReview = async (mediaId: string) => {
  const { user } = useUserStore()
  if (!user) return useRouter().push("/account/login?r=" + encodeURIComponent(useRoute().fullPath))

  const data = await $fetch(`/api/media/${mediaId}/reviews`, {
    method: "delete",
    headers: generateHeaders()
  })

  if (data) {
    user.reviews = user.reviews.filter((id) => id !== mediaId)
  }

  return data
}
