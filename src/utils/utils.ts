import redis from "~/utils/redis"

export const smartFetch = async (url: string, ...args: any[]) => {
  const response = await redis.get(`url:${url}`)
  if (response) return response
  const data = await $fetch(url, ...args)
  await redis.set(`url:${url}`, data, {
    ex: 60 * 60 * 12
  })
  return data
}

export const getBlob = async (url: string) => {
  const response = await fetch(url)
  return await response.blob()
}
