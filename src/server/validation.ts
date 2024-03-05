import Joi from "joi"

export const UserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(16).required(),
  password: Joi.string().min(8).max(128).required(),
  email: Joi.string().lowercase().email().required(),
  inviteCode: Joi.string()
})

export const UserPatchableSchema = Joi.object({
  username: Joi.string().alphanum().allow("").allow(null).min(3).max(16),
  about: Joi.string().allow(null).allow("").max(512),
  avatar: Joi.string().allow(null).allow("").max(2_000_000),
  banner: Joi.string().allow(null).allow("").max(2_000_000),
  likes: Joi.array().items(Joi.string()),
  reviews: Joi.array().items(Joi.string()),
  watchlist: Joi.array().items(Joi.string()),
  watcheds: Joi.array().items(Joi.string())
})

export const ReviewSchema = Joi.object({
  id: Joi.string().required(),
  rating: Joi.number().min(0.5).max(10).required(),
  review: Joi.string().allow(null).allow("").max(512),
  spoiler: Joi.boolean().allow(null)
})

export const LoginSchema = Joi.object({
  username: Joi.alternatives()
    .try(
      Joi.string().min(3).max(16).alphanum().required(),
      Joi.string().lowercase().email().required()
    )
    .required()
    .error(new Error("Invalid email or username")),
  password: Joi.string().min(8).max(128).required()
})
