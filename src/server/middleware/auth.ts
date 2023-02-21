import jwt from "jsonwebtoken"
import { IUser } from "~/@types"
import UserModel from "../models/User.model"

export default defineEventHandler(async (event) => {
  if (event.node.req.headers.authorization) {
    const token = event.node.req.headers.authorization.split(" ")[1]
    const decoded: any = jwt.decode(token)
    if (decoded) {
      const user: Partial<IUser> = await UserModel.findById(decoded.id).lean()
      if (user) {
        try {
          const secret = `${user.password}${user.createdAt}`
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
