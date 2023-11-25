<script setup lang="ts">
import { getRandomCharacter } from "~/utils/functions"
const { $socket } = useNuxtApp()
const connected = ref(false)

const config = reactive({
  user: {
    id: "user",
    username: getRandomCharacter(),
    host: false
  },
  roomId: "",
  joined: false
})
const msg = ref("")
const chatHistory = ref<any[]>([])

const joinRoom = () => {
  $socket.emit("join", config.roomId)
  $socket.emit("message", {
    type: "hello",
    to: config.roomId,
    user: config.user,
    message: "Joined"
  })
  config.joined = true
}

const leaveRoom = () => {
  $socket.emit("leave", config.roomId)
  $socket.emit("message", {
    type: "hello",
    to: config.roomId,
    user: config.user,
    message: "Left"
  })
  config.joined = false
  config.user.host = false
  chatHistory.value = []
}

const sendMsg = () => {
  if (msg.value.trim().length === 0) return
  $socket.emit("message", {
    type: "chat",
    to: config.roomId,
    user: config.user,
    message: msg.value
  })
  msg.value = ""
}

onMounted(() => {
  $socket.on("message", (d) => {
    switch (d.type) {
      case "hello":
        chatHistory.value.push(d)
        break
      case "chat":
        chatHistory.value.push(d)
        break
      default:
        break
    }
  })

  $socket.on("joined", (l) => {
    if (l === 1) {
      config.user.host = true
    }
  })

  $socket.on("connect", () => {
    connected.value = $socket.connected
    config.user.id = $socket.id
  })

  $socket.on("disconnect", () => {
    connected.value = $socket.connected
  })

  $socket.connect()
})

onUnmounted(() => {
  $socket.disconnect()
  $socket.off("connect")
  $socket.off("disconnect")
  $socket.off("message")
  $socket.off("joined")
})
</script>

<template>
  <div class="mt-24 px-6">
    <div class="flex w-fit flex-col gap-2">
      <p>Connected: {{ connected }}</p>
      <p>Host: {{ config.user.host }}</p>
      <input
        type="text"
        class="rounded border-0 bg-gray-800 px-4 py-2 disabled:opacity-75"
        :disabled="config.joined"
        v-model="config.user.username"
      />
      <input
        type="text"
        class="rounded border-0 bg-gray-800 px-4 py-2 disabled:opacity-75"
        :disabled="config.joined"
        v-model="config.roomId"
      />
      <button
        v-if="!config.joined"
        class="rounded border border-gray-400 px-4 py-2 text-sm font-bold uppercase text-white"
        @click="joinRoom"
      >
        join
      </button>
      <button
        v-else
        class="rounded border border-gray-400 px-4 py-2 text-sm font-bold uppercase text-white"
        @click="leaveRoom"
      >
        leave
      </button>
    </div>
    <div v-if="config.joined" class="mb-24 mt-4 space-y-2">
      <p class="text-gray-400" v-for="msg in chatHistory">
        <span
          class="mr-2 inline-block w-12 rounded bg-gray-800 text-center font-semibold text-yellow-200"
          >{{ msg.type }}</span
        >
        <span
          v-if="msg.user.host"
          class="mr-2 inline-block w-12 rounded bg-gray-800 text-center font-semibold text-yellow-200"
          >host</span
        >
        <span
          class="mr-2 inline-block rounded bg-gray-800 px-2 text-center font-semibold text-blue-700"
          >{{ msg?.user?.username }}</span
        >
        {{ msg.message }}
      </p>
      <input
        type="text"
        class="w-1/2 rounded border-0 bg-gray-800 px-4 py-2"
        v-model="msg"
        @keyup.enter="sendMsg"
      />
      <button
        class="ml-2 rounded border border-gray-400 px-4 py-2 text-sm font-bold uppercase text-white"
        @click="sendMsg"
      >
        send
      </button>
    </div>
  </div>
</template>
