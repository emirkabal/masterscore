import Joi from "joi"

export const UserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(16).required(),
  password: Joi.string().min(8).max(32).required(),
  email: Joi.string().email().min(5).max(255).required()
})

export const UserPatchableSchema = Joi.object({
  about: Joi.string().allow(null).allow("").max(512),
  banner: Joi.string().allow(null).allow("").max(128).uri(),
  likes: Joi.array().items(Joi.string()),
  reviews: Joi.array().items(Joi.string()),
  watchlist: Joi.array().items(Joi.string()),
  watcheds: Joi.array().items(Joi.string())
})

export const ReviewSchema = Joi.object({
  id: Joi.string().required(),
  rating: Joi.number().min(0.5).max(10).required(),
  review: Joi.string().allow(null).allow("").max(512)
})
