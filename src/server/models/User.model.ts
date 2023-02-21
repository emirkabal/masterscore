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
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "entertainment"
      }
    ],
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "entertainment"
      }
    ],
    watchlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "entertainment"
      }
    ],
    watcheds: [
      {
        type: Schema.Types.ObjectId,
        ref: "entertainment"
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export default model("user", schema)
