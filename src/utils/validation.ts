import { z } from "zod"

export const LoginSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(16)
    .regex(/^[a-zA-Z0-9]+$/)
    .or(z.string().email()),
  password: z.string().min(8).max(128)
})

export const SignupSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(16)
    .regex(/^[a-zA-Z0-9]+$/),
  password: z.string().min(8).max(128),
  confirm_password: z.string().min(8).max(128),
  email: z.string().email()
})

export const UserPatchableSchema = z.object({
  display_name: z.string().min(0).max(32).nullable().optional(),
  username: z
    .string()
    .regex(/^[a-zA-Z0-9]+$/)
    .min(3)
    .max(16)
    .nullable()
    .optional(),
  about: z.string().min(0).max(512).nullable().optional(),
  avatar: z.string().min(0).max(2_000_000).nullable().optional(),
  banner: z.string().min(0).max(2_000_000).nullable().optional()
})
