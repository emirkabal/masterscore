import { Server as SocketServer } from "socket.io"
import socketHandler from "~/socket/handler"

let io: any

export default defineEventHandler(async (event) => {
  // @ts-ignore
  if (!io && event.node.res.socket?.server) {
    // @ts-ignore
    io = new SocketServer(event.node.res.socket.server, {
      transports: ["polling"]
    })
    socketHandler(io)
  }
})
