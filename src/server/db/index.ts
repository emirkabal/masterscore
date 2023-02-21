import mongoose from "mongoose";

export default async () => {
  const config = useRuntimeConfig();
  mongoose.set("strictQuery", true);
  mongoose
    .connect(config.MONGO_URI)
    .then(() => console.log("Connected to DB"))
    .catch((e) => console.log(e));
};
