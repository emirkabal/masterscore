import { Server } from "socket.io"
import { defineNuxtModule } from "@nuxt/kit"

export default defineNuxtModule({
  setup(_, nuxt) {
    nuxt.hook("listen", async (server) => {
      const io = new Server(server)

      nuxt.hook("close", () => io.close())
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

        console.log(`Socket connected: ${socket.id}`)
      })
    })
  }
})
