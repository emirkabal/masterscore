import Joi from "joi"

export const UserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(16).required(),
  password: Joi.string().min(8).max(128).required(),
  email: Joi.string().lowercase().email().required()
})

export const UserPatchableSchema = Joi.object({
  display_name: Joi.string().allow("").allow(null).max(32),
  username: Joi.string().alphanum().allow("").allow(null).min(3).max(16),
  about: Joi.string().allow(null).allow("").max(512),
  avatar: Joi.string().allow(null).allow("").max(2_000_000),
  banner: Joi.string().allow(null).allow("").max(2_000_000)
})

export const ReviewSchema = Joi.object({
  rating: Joi.number().min(0.5).max(10).required(),
  content: Joi.string().allow(null).allow("").max(512),
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
