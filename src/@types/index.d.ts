import { H3Event } from "h3"

export interface IEntertainment {
  _id?: string
  id: string
  type: string
  info: {
    title: string
    description?: string
    poster?: string
    backdrop?: string
    release_date: string
    rated?: string
    imbdId?: string
    runtime?: number
    ratings?: {
      imdb?: number
      tmdb?: number
      rotten_tomatoes?: number
      metacritic?: number
    }
  }
}

export interface TMDBSearchResult {
  adult?: boolean
  backdrop_path?: string
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
  vote_average?: number
  vote_count?: number
}

export interface TMDBMovie {
  localId?: string
  localData?: IEntertainment
  adult?: boolean
  backdrop_path?: string
  belongs_to_collection?: {
    id: number
    name: string
    poster_path: string
    backdrop_path: string
  }
  budget?: number
  genres?: {
    id: number
    name: string
  }[]
  homepage?: string
  id: number

  imdb_id?: string
  original_language?: string
  original_title?: string
  overview?: string
  popularity?: number
  poster_path?: string
  production_companies?: {
    id: number
    logo_path?: string
    name: string
    origin_country: string
  }[]
  production_countries?: {
    iso_3166_1: string
    name: string
  }[]
  release_date?: string
  revenue?: number
  runtime?: number
  spoken_languages?: {
    english_name: string
    iso_639_1: string
    name: string
  }[]
  status?: string
  tagline?: string
  title?: string
  video?: boolean
  vote_average?: number
  vote_count?: number
}

export interface TMDBTV {
  localId?: string
  localData?: IEntertainment
  imdb_id?: string
  backdrop_path?: string
  created_by?: {
    id: number
    credit_id: string
    name: string
    gender: number
    profile_path?: string
  }[]
  episode_run_time?: number[]
  first_air_date?: string
  genres?: {
    id: number
    name: string
  }[]
  homepage?: string
  id: number
  in_production?: boolean
  languages?: string[]
  last_air_date?: string
  last_episode_to_air?: {
    air_date: string
    episode_number: number
    id: number
    name: string
    overview: string
    production_code: string
    season_number: number
    still_path?: string
    vote_average: number
    vote_count: number
  }
  name?: string
  networks?: {
    name: string
    id: number
    logo_path?: string
    origin_country: string
  }[]
  next_episode_to_air?: null
  number_of_episodes?: number
  number_of_seasons?: number
  origin_country?: string[]
  original_language?: string
  original_name?: string
  overview?: string
  popularity?: number
  poster_path?: string
  production_companies?: {
    id: number
    logo_path?: string
    name: string
    origin_country: string
  }[]
  production_countries?: {
    iso_3166_1: string
    name: string
  }[]
  seasons?: {
    air_date: string
    episode_count: number
    id: number
    name: string
    overview: string
    poster_path?: string
    season_number: number
  }[]
  spoken_languages?: {
    english_name: string
    iso_639_1: string
    name: string
  }[]
  status?: string
  tagline?: string
  type?: string
  vote_average?: number
  vote_count?: number
}

export interface IUser {
  _id?: string
  email: string
  username: string
  password: string
  about?: string | null
  banner?: string | null
  likes?: string[]
  reviews?: string[]
  watchlist?: string[]
  watcheds?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface IActivity {
  _id?: string
  type: string
  attribute?: string
  entertainment: IEntertainment
  author: string
  createdAt: Date
  updatedAt: Date
}

export interface IReview {
  _id?: string
  rating: number
  content?: string
  entertainment: {
    id: string
    type: string
    data: TMDBMovie | TMDBTV
  }
  attribute?: string
  rating: number
  content?: string
  author: Omit<IUser, "password">
  createdAt: Date
  updatedAt: Date
}

export interface ILike {
  _id?: string
  entertainment: IEntertainment
  likes: number
}

export interface ErrorResponse {
  status: number
  message: string
}

export declare module "h3" {
  export interface H3EventContext {
    user?: IUser
  }
}
