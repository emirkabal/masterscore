import jwt from "jsonwebtoken"
import type { IUser } from "~/types"
import UserModel from "../models/User.model"
const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  if (event.node.req.headers.authorization) {
    const token = event.node.req.headers.authorization.split(" ")[1]
    const decoded: any = jwt.decode(token)
    if (decoded) {
      // @ts-ignore:2322
      const user: Partial<IUser> = await UserModel.findById(decoded.id).lean()
      if (user) {
        try {
          const secret = config.JWT_SECRET + user.password
          const valid = jwt.verify(token, secret)
          if (valid) {
            delete user.password
            event.context.user = user as IUser
          }
        } catch (error) {
          event.context.user = undefined
        }
      }
    }
  }
})
