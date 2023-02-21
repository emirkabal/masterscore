import mongoose, { Schema } from "mongoose"
const schema: Schema = new Schema(
  {
    entertainment: {
      type: Schema.Types.ObjectId,
      ref: "entertainment"
    },
    likes: {
      type: Number,
      required: true
    }
  },
  {
    versionKey: false
  }
)

export default mongoose.model("like", schema)
