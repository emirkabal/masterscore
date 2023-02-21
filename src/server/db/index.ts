import mongoose from "mongoose"
import "~/server/models/Entertainment.model"
import "~/server/models/Activity.model"
import "~/server/models/Like.model"
import "~/server/models/Review.model"
import "~/server/models/User.model"

export default async () => {
  const config = useRuntimeConfig()
  mongoose.set("strictQuery", true)
  mongoose
    .connect(config.MONGO_URI)
    .then(() => console.log("Connected to DB"))
    .catch((e) => console.log(e))
}
