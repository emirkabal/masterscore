import { model, Schema } from "mongoose"

const schema: Schema = new Schema(
  {
    type: {
      type: String,
      required: true
    },
    attribute: {
      type: Object,
      required: false
    },
    entertainment: {
      type: Schema.Types.ObjectId,
      ref: "Entertainment"
    },
    review: {
      type: Schema.Types.ObjectId,
      ref: "Review",
      required: false
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

export default model("Activities", schema)
