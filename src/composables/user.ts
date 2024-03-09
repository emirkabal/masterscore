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

export const likeMedia = async (mediaId: string) => {
  const { user } = useUserStore()
  if (!user) return useRouter().push("/account/login?r=" + encodeURIComponent(useRoute().fullPath))

  const data = await $fetch(`/api/media/${mediaId}/like`, {
    method: "patch",
    headers: generateHeaders()
  })

  if (!data.liked) {
    user.likes = user?.likes.filter((id) => id !== mediaId)
  } else {
    user.likes.push(mediaId)
  }

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

  const data = await $fetch(`/api/media/${mediaId}/reviews`, {
    method: "post",
    headers: generateHeaders(),
    body: JSON.stringify({
      ...context
    })
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
