import { IUser } from "~/@types"

export default (user: Partial<IUser>) => {
    if (!user.verified) user.verified = false
    if (!user.about) user.about = null
    if (!user.banner) user.banner = null
    if (!user.likes) user.likes = []
    if (!user.reviews) user.reviews = []
    if (!user.watchlist) user.watchlist = []
    if (!user.watcheds) user.watcheds = []
    if (!user.following) user.following = []
    if (!user.followers) user.followers = []
    return user as IUser
}
