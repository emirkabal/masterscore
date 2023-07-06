type PosterSizes =
  | "w92"
  | "w154"
  | "w185"
  | "w342"
  | "w500"
  | "w780"
  | "original"
type BackdropSizes = "w300" | "w780" | "w1280" | "original"
type LogoSizes = "w45" | "w92" | "w154" | "w185" | "w300" | "w500" | "original"

export default defineNuxtPlugin(() => {
  return {
    provide: {
      timage: (path: string, size: PosterSizes | BackdropSizes | LogoSizes) => {
        return `https://image.tmdb.org/t/p/${size}/${path}`
      }
    }
  }
})
