import mongoose, { Schema } from "mongoose"

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
      ref: "entertainment"
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export default mongoose.model("review", schema)
