import { model, Schema } from "mongoose"
const schema: Schema = new Schema(
  {
    entertainment: {
      type: Schema.Types.ObjectId,
      ref: "Entertainment"
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

export default model("Like", schema)
