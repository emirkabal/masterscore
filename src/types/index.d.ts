import { H3Event } from "h3"

export interface User {
  id: string
  username: string
  email: string
  password: string
  verified: boolean
  display_name?: string
  about?: string
  avatar?: string
  banner?: string
  reviews: string[]
  likes: string[]
  collections: Collection<string>[]
  verified_at?: string
  username_changed_at?: string
  created_at: string
  updated_at: string
}

export type APIUser = Omit<User, "password" | "email"> & {
  _count: {
    reviews: number
    likes: number
    collections: number
  }
}

export interface Review {
  id: string
  content: string
  rating: number
  media_id: string
  user_id: string
  media: Media
  user: User
  created_at: string
  updated_at: string
}

export interface Like {
  id: string
  user_id: string
  user: User
  media_id: string
  media: Media
  created_at: string
  updated_at: string
}

export interface Collection<T> {
  id: string
  name: string
  description?: string
  image?: string
  private: boolean
  user_id: string
  user: User
  list: T[]
  created_at: string
  updated_at: string
}

export interface CollectionMedia {
  id: string
  note?: string
  collection_id: string
  media_id: string
  collection: Collection
  media: Media
  created_at: string
  updated_at: string
}

export interface Scores {
  imdb?: number
  rotten_tomatoes?: number
  metacritic?: number
  tmdb?: number
}

export interface Images {
  poster?: string
  backdrop?: string
  logo?: string
}

export interface Media {
  id: string
  type: MediaType
  title: string
  description: string
  images: Images
  release_date: string
  imdb_id: string
  tmdb_id: number
  rated: string
  runtime: number
  scores: Scores
  reviews: Review[]
  likes: Like[]
  collections: CollectionMedia[]
  created_at: string
  updated_at: string
}

export type MediaType = "movie" | "tv"

export type CollapsedMedia = TMDBMedia & {
  media: Media & { score: number; _count: { likes: number; reviews: number } }
}

export interface TMDBMedia {
  adult: boolean
  backdrop_path: string
  budget: number
  homepage: string
  id: number
  imdb_id: string
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string
  release_date: string
  revenue: number
  runtime: number
  status: string
  tagline: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number

  //tv

  first_air_date: string
  last_air_date: string
  name: string
  original_name: string
  number_of_episodes: number
  number_of_seasons: number
  languages: string[]
  type: string
  origin_country: string[]
  in_production: boolean
  episode_run_time: number[]

  spoken_languages: SpokenLanguage[]
  genres: TMDBGenre[]
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  networks: Network[]
  seasons: Season[]
  created_by: CreditsResult[]

  belongs_to_collection: BelongsToCollection
  last_episode_to_air: LNEpisodeToAir
  next_episode_to_air: LNEpisodeToAir
  videos: Videos
  similar: TMDBSearchResults<TMDBResult>
  recommendations: TMDBSearchResults<TMDBResult>
  credits: Credits

  external_ids: ExternalIds
  images: {
    backdrops: TMDBImage[]
    posters: TMDBImage[]
    logos: TMDBImage[]
  }
}

export interface TMDBImage {
  aspect_ratio: number
  file_path: string
  height: number
  iso_639_1: string
  vote_average: number
  vote_count: number
  width: number
}

export interface ProductionCompany {
  id: number
  logo_path: string
  name: string
  origin_country: string
}

export interface ProductionCountry {
  iso_3166_1: string
  name: string
}

export interface SpokenLanguage {
  english_name: string
  iso_639_1: string
  name: string
}

export interface BelongsToCollection {
  id: number
  name: string
  poster_path: string
  backdrop_path: string
}

export interface CreatedBy {
  id: number
  credit_id: string
  name: string
  gender: number
  profile_path: string
}

export interface LNEpisodeToAir {
  id: number
  name: string
  overview: string
  vote_average: number
  vote_count: number
  air_date: string
  episode_number: number
  episode_type: string
  production_code: string
  runtime: number
  season_number: number
  show_id: number
  still_path: string
}

export interface Videos {
  results: VideoResult[]
}

export interface VideoResult {
  iso_639_1: string
  iso_3166_1: string
  name: string
  key: string
  site: string
  size: number
  type: string
  official: boolean
  published_at: string
  id: string
}

export interface Credits {
  cast: CreditsResult[]
  crew: CreditsResult[]
}

export interface TMDBGenre {
  id: number
  name: string
}

export interface TMDBSearchResults<T> {
  results: T[]
  page: number
  total_results: number
  total_pages: number
}

export interface TMDBResult {
  adult?: boolean
  backdrop_path?: string
  profile_path?: string
  genre_ids?: number[]
  id: number
  original_language?: string
  original_title?: string
  overview?: string
  popularity?: number
  media_type: string
  poster_path?: string
  release_date?: string
  first_air_date?: string
  title?: string
  name?: string
  video?: boolean
  media_type?: string
  vote_average?: number
  vote_count?: number
}

export interface CreditsResult {
  adult: boolean
  cast_id: number
  character: string
  credit_id: string
  gender: number
  id: number
  known_for_department: string
  name: string
  order: number
  original_name: string
  popularity: number
  profile_path: string
  department: string
  media_type: string
  release_date: string
  first_air_date: string
  vote_count: number
  vote_average: number
  title: string
  job: string
  year: string
}

export interface VideoResult {
  id: string
  iso_639_1: string
  iso_3166_1: string
  key: string
  name: string
  site: string
  size: number
  type: string
}

export interface Season {
  id: number | string
  name: string
  overview: string
  air_date: string
  episode_count: number
  poster_path?: string
  season_number: number
}

export interface Episode {
  air_date: string
  episode_number: number
  id: number
  name: string
  overview: string
  production_code: string
  runtime: number
  season_number: number
  still_path?: string
  vote_average: number
  vote_count: number
  crew: CreditsResult[]
  guest_stars: CreditsResult[]
}

export interface Network {
  id: number
  logo_path: string
  name: string
  origin_country: string
}

export interface EpisodeGroups {
  id: number
  results: {
    description: string
    episode_count: number
    group_count: number
    id: string
    name: string
    network?: Network
    type: number
  }[]
}

export interface EpisodeGroupsDetails {
  id: string
  name: string
  type: number
  description: string
  episode_count: number
  group_count: number
  groups: {
    id: string
    name: string
    order: number
    episodes: Episode[]
  }[]
  network?: Network
}

export interface TMDBCollectionDetails {
  id: number
  name: string
  overview: string
  poster_path: string
  backdrop_path: string
  parts: TMDBSearchResult[]
}

export interface TMDBPersonSalt {
  birthday?: string
  known_for_department: string
  deathday?: string
  id: number
  name: string
  also_known_as: string[]
  gender: 0 | 1 | 2 | 3
  biography: string
  popularity: number
  place_of_birth?: string
  profile_path?: string
  adult: boolean
  homepage?: string
  combined_credits?: {
    cast: CreditsResult[]
    crew: CreditsResult[]
  }
}

export interface ExternalIds {
  id: number
  imdb_id?: string
  facebook_id?: string
  freebase_mid?: string
  freebase_id?: string
  tvrage_id?: number
  twitter_id?: string
  instagram_id?: string
  youtube_id?: string
  wikidata_id?: string
  tiktok_id?: string
}

export type TMDBPerson = TMDBPersonSalt & {
  external_ids?: ExternalIds
}

export interface ProviderResults {
  streams: {
    name: string
    title: string
    externalUrl: string
    androidTvUrl: string
  }[]
}

export type PosterSizes =
  | "w92"
  | "w154"
  | "w185"
  | "w300_and_h450_bestv2"
  | "w342"
  | "w500"
  | "w780"
  | "original"
export type BackdropSizes = "w300" | "w780" | "w1280" | "original"
export type LogoSizes = "w45" | "w92" | "w154" | "w185" | "w300" | "w500" | "original"

export type Genre =
  | "Action & Adventure"
  | "Animation"
  | "Comedy"
  | "Crime"
  | "Family"
  | "Kids"
  | "News"
  | "Reality"
  | "Sci-Fi & Fantasy"
  | "Soap"
  | "Talk"
  | "War & Politics"
  | "Action"
  | "Adventure"
  | "Documentary"
  | "Drama"
  | "Fantasy"
  | "History"
  | "Horror"
  | "Music"
  | "Mystery"
  | "Romance"
  | "Science Fiction"
  | "TV Movie"
  | "Thriller"
  | "War"
  | "Western"

export interface OMDBMedia {
  Title: string
  Year: string
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Poster: string
  Ratings: {
    Source: string
    Value: string
  }[]
  Metascore: string
  imdbRating: string
  imdbVotes: string
  imdbID: string
  Type: string
  DVD: string
  BoxOffice: string
  Production: string
  Website: string
  Response: string
}

export declare module "h3" {
  export interface H3EventContext {
    user?: User
  }
}
