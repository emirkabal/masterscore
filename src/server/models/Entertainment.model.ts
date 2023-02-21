import mongoose, { Schema } from "mongoose"

const schema: Schema = new Schema(
  {
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    info: {
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: false
      },
      poster: {
        type: String,
        required: false
      },
      backdrop: {
        type: String,
        required: false
      },
      release_date: {
        type: String,
        required: false
      },
      imdbId: {
        type: String,
        required: false
      },
      rated: {
        type: String,
        required: false
      },
      runtime: {
        type: Number,
        required: false
      },
      ratings: {
        imdb: {
          type: Number,
          required: false
        },
        rotten_tomatoes: {
          type: Number,
          required: false
        },
        metacritic: {
          type: Number,
          required: false
        },
        tmdb: {
          type: Number,
          required: false
        }
      }
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export default mongoose.model("entertainment", schema)
