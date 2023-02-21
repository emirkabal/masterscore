import mongoose, { Schema } from "mongoose"

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

export default mongoose.model("activities", schema)
