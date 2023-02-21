import { model, Schema } from "mongoose"

const schema: Schema = new Schema(
  {
    rating: {
      type: Number,
      required: true
    },
    content: {
      type: String,
      required: false
    },
    entertainment: {
      type: Schema.Types.ObjectId,
      ref: "Entertainment"
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export default model("Review", schema)
