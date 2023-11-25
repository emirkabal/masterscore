import { Server } from "socket.io"

export default (io: Server) => {
  io.on("connection", (socket) => {
    socket.on("yell", (message) => {
      socket.broadcast.emit("message", message)
    })
    socket.on("message", (message) => {
      socket.to(message.to).emit("message", message)
    })
    socket.on("join", (room) => {
      socket.rooms.forEach((room) => socket.leave(room))
      socket.join(room)
      // @ts-ignore

      socket.emit("joined", io.sockets.adapter.rooms.get(room)?.size || 0)
    })
    socket.on("leave", (room) => {
      socket.leave(room)
    })

    // console.log(`Socket connected: ${socket.id}`)
  })
}
