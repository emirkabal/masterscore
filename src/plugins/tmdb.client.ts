import { TMDBData, TMDBSearchResult } from "~/@types"

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

const genres = [
  {
    id: 10759,
    name: "Action & Adventure"
  },
  {
    id: 16,
    name: "Animation"
  },
  {
    id: 35,
    name: "Comedy"
  },
  {
    id: 80,
    name: "Crime"
  },
  {
    id: 10751,
    name: "Family"
  },
  {
    id: 10762,
    name: "Kids"
  },
  {
    id: 10763,
    name: "News"
  },
  {
    id: 10764,
    name: "Reality"
  },
  {
    id: 10765,
    name: "Sci-Fi & Fantasy"
  },
  {
    id: 10766,
    name: "Soap"
  },
  {
    id: 10767,
    name: "Talk"
  },
  {
    id: 10768,
    name: "War & Politics"
  },
  {
    id: 28,
    name: "Action"
  },
  {
    id: 12,
    name: "Adventure"
  },
  {
    id: 99,
    name: "Documentary"
  },
  {
    id: 18,
    name: "Drama"
  },
  {
    id: 14,
    name: "Fantasy"
  },
  {
    id: 36,
    name: "History"
  },
  {
    id: 27,
    name: "Horror"
  },
  {
    id: 10402,
    name: "Music"
  },
  {
    id: 9648,
    name: "Mystery"
  },
  {
    id: 10749,
    name: "Romance"
  },
  {
    id: 878,
    name: "Science Fiction"
  },
  {
    id: 10770,
    name: "TV Movie"
  },
  {
    id: 53,
    name: "Thriller"
  },
  {
    id: 10752,
    name: "War"
  },
  {
    id: 37,
    name: "Western"
  }
]

export default defineNuxtPlugin(() => {
  return {
    provide: {
      timage: (path: string, size: PosterSizes | BackdropSizes | LogoSizes) => {
        return `https://image.tmdb.org/t/p/${size}/${path}`
      },
      tgenre: (id: number) => {
        return genres.find((genre) => genre.id === id)?.name
      },
      getTitle: (data: TMDBData | TMDBSearchResult) => {
        return data.title || data.name || "Untitled"
      },
      getYear: (item: TMDBData | TMDBSearchResult) => {
        return (
          (item.release_date && new Date(item.release_date).getFullYear()) ||
          (item.first_air_date && new Date(item.first_air_date).getFullYear())
        )
      }
    }
  }
})
