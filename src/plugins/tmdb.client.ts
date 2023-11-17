import type {
  BackdropSizes,
  Genre,
  LogoSizes,
  PosterSizes,
  TMDBData,
  TMDBSearchResult
} from "~/types"

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

const providers = [
  { name: "YouTube Premium", logo: "/6IPjvnYl6WWkIwN158qBFXCr2Ne.jpg" },
  { name: "Netflix", logo: "/t2yyOv40HZeVlLjYsCsPHnWLk4W.jpg" },
  { name: "blutv", logo: "/z3XAGCCbDD3KTZFvc96Ytr3XR56.jpg" },
  { name: "puhutv", logo: "/3namPdisFuyTbB8BX2PxT3OdVCG.jpg" },
  { name: "Amazon Prime Video", logo: "/emthp39XA2YScoYL1p0sdbAH2WA.jpg" },
  { name: "Google Play Movies", logo: "/tbEdFQDwx5LEVr8WpSeXQSIirVq.jpg" },
  { name: "Apple TV", logo: "/peURlLlr8jggOwK53fJ5wdQl05y.jpg" },
  { name: "MUBI", logo: "/bVR4Z1LCHY7gidXAJF5pMa4QrDS.jpg" },
  { name: "Curiosity Stream", logo: "/67Ee4E6qOkQGHeUTArdJ1qRxzR2.jpg" },
  { name: "Disney Plus", logo: "/7rwgEs15tFwyR9NPQ5vpzxTj19Q.jpg" },
  { name: "Spamflix", logo: "/xN97FFkFAdY1JvHhS4zyPD4URgD.jpg" },
  { name: "DOCSVILLE", logo: "/bvcdVO7SDHKEa6D40g1jntXKNj.jpg" },
  { name: "WOW Presents Plus", logo: "/mgD0T960hnYU4gBxbPPBrcDfgWg.jpg" },
  { name: "Magellan TV", logo: "/gekkP93StjYdiMAInViVmrnldNY.jpg" },
  { name: "BroadwayHD", logo: "/xLu1rkZNOKuNnRNr70wySosfTBf.jpg" },
  { name: "Filmzie", logo: "/olmH7t5tEng8Yuq33KmvpvaaVIg.jpg" },
  { name: "Dekkoo", logo: "/u2H29LCxRzjZVUoZUQAHKm5P8Zc.jpg" },
  { name: "True Story", logo: "/osREemsc9uUB2J8VTkQeAVk2fu9.jpg" },
  { name: "DocAlliance Films", logo: "/aQ1ritN00jXc7RAFfUoQKGAAfp7.jpg" },
  { name: "Hoichoi", logo: "/d4vHcXY9rwnr763wQns2XJThclt.jpg" },
  { name: "Eventive", logo: "/fadQYOyKL0tqfyj012nYJxm3N2I.jpg" },
  { name: "Cultpix", logo: "/59azlQKUgFdYq6QI5QEAxIeecyL.jpg" },
  { name: "FilmBox+", logo: "/4FqTBYsUSZgS9z9UGKgxSDBbtc8.jpg" },
  { name: "Takflix", logo: "/cnIHBy3uLWhHRR7VeWQhK3ZsYP0.jpg" },
  { name: "Sun Nxt", logo: "/uW4dPCcbXaaFTyfL5HwhuDt5akK.jpg" },
  { name: "Classix", logo: "/iaMw6nOyxUzXSacrLQ0Au6CfZkc.jpg" },
  { name: "TOD", logo: "/eXxCDzaz4F7bkkgkZ8p6AbNQ8Dk.jpg" },
  { name: "Crunchyroll", logo: "/8Gt1iClBlzTeQs8WQm8UrCoIxnQ.jpg" },
  { name: "Shahid VIP", logo: "/uurfHKuprPDeKfIs7FYd5lQzw0L.jpg" }
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
        const list = genres.filter((genre) => names.includes(genre.name as Genre))
        if (support) return list.filter((genre) => genre.support.includes(support))
        return list
      },
      tgetgenre: (name: Genre) => {
        return genres.find((genre) => genre.name === name)
      },
      tgenres: genres,
      getTitle: (data: TMDBData | TMDBSearchResult) => {
        return data.title || data.name || "Untitled"
      },
      getProvider: (name: string) => {
        return providers.find((p) => p.name === name)
      },
      getOriginalTitle: (data: TMDBData | TMDBSearchResult) => {
        return data.original_title || ("original_name" in data && data.original_name) || "Untitled"
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
