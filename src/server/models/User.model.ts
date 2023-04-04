import { model, Schema } from "mongoose"

const schema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    about: {
      type: String,
      required: false
    },
    banner: {
      type: String,
      required: false
    },
    avatar: {
      type: String,
      required: false
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Entertainment"
      }
    ],
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Entertainment"
      }
    ],
    watchlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Entertainment"
      }
    ],
    watcheds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Entertainment"
      }
    ],
    latestUsernameChange: {
      type: Date,
      required: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export default model("User", schema)
