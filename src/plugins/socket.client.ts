import io from "socket.io-client"

export default defineNuxtPlugin(() => {
  const socket = io({
    autoConnect: false
  })

  return {
    provide: {
      socket
    }
  }
})
