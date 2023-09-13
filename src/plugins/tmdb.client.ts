import {
  BackdropSizes,
  Genre,
  LogoSizes,
  PosterSizes,
  TMDBData,
  TMDBSearchResult
} from "~/@types"

const genres = [
  {
    id: 10759,
    name: "Action & Adventure",
    support: ["tv"]
  },
  {
    id: 16,
    name: "Animation",
    support: ["movie", "tv"]
  },
  {
    id: 35,
    name: "Comedy",
    support: ["movie", "tv"]
  },
  {
    id: 80,
    name: "Crime",
    support: ["movie", "tv"]
  },
  {
    id: 10751,
    name: "Family",
    support: ["movie", "tv"]
  },
  {
    id: 10762,
    name: "Kids",
    support: ["tv"]
  },
  {
    id: 10763,
    name: "News",
    support: ["tv"]
  },
  {
    id: 10764,
    name: "Reality",
    support: ["tv"]
  },
  {
    id: 10765,
    name: "Sci-Fi & Fantasy",
    support: ["tv"]
  },
  {
    id: 10766,
    name: "Soap",
    support: ["tv"]
  },
  {
    id: 10767,
    name: "Talk",
    support: ["tv"]
  },
  {
    id: 10768,
    name: "War & Politics",
    support: ["tv"]
  },
  {
    id: 28,
    name: "Action",
    support: ["movie"]
  },
  {
    id: 12,
    name: "Adventure",
    support: ["movie"]
  },
  {
    id: 99,
    name: "Documentary",
    support: ["movie", "tv"]
  },
  {
    id: 18,
    name: "Drama",
    support: ["movie", "tv"]
  },
  {
    id: 14,
    name: "Fantasy",
    support: ["movie"]
  },
  {
    id: 36,
    name: "History",
    support: ["movie", "tv"]
  },
  {
    id: 27,
    name: "Horror",
    support: ["movie"]
  },
  {
    id: 10402,
    name: "Music",
    support: ["movie", "tv"]
  },
  {
    id: 9648,
    name: "Mystery",
    support: ["movie", "tv"]
  },
  {
    id: 10749,
    name: "Romance",
    support: ["movie", "tv"]
  },
  {
    id: 878,
    support: ["movie"],
    name: "Science Fiction"
  },
  {
    id: 10770,
    name: "TV Movie",
    support: ["movie"]
  },
  {
    id: 53,
    name: "Thriller",
    support: ["movie"]
  },
  {
    id: 10752,
    name: "War",
    support: ["movie"]
  },
  {
    id: 37,
    name: "Western",
    support: ["movie", "tv"]
  }
]

export default defineNuxtPlugin(() => {
  return {
    provide: {
      timage: (path: string, size: PosterSizes | BackdropSizes | LogoSizes) => {
        return `https://image.tmdb.org/t/p/${size}/${path}`
      },
      tgenre: (id: number | string) => {
        return genres.find((genre) => genre.id == id)?.name
      },
      tfiltergenres: (names: Genre[], support?: "movie" | "tv") => {
        const list = genres.filter((genre) =>
          names.includes(genre.name as Genre)
        )
        if (support)
          return list.filter((genre) => genre.support.includes(support))
        return list
      },
      tgetgenre: (name: Genre) => {
        return genres.find((genre) => genre.name == name)
      },
      tgenres: genres,
      getTitle: (data: TMDBData | TMDBSearchResult) => {
        return data.title || data.name || "Untitled"
      },
      getOriginalTitle: (data: TMDBData | TMDBSearchResult) => {
        return (
          data.original_title ||
          ("original_name" in data && data.original_name) ||
          "Untitled"
        )
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
