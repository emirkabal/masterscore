import { IUser } from "~/@types"

export default (user: Partial<IUser>) => {
  delete user.password
  return user as Omit<IUser, "password">
}
