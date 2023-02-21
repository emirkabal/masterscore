export default (url: string) => {
  const reqURL = url?.replace("/", ".")
  const redisKey = reqURL === "." ? "page.home" : `page${reqURL}`
  return redisKey
}
