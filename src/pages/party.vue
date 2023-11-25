<script setup lang="ts">
import { useScroll } from "@vueuse/core"
import { getRandomCharacter } from "~/utils/functions"
const { $socket } = useNuxtApp()

const connected = ref(false)

const config = reactive({
  user: {
    id: "user",
    username: "",
    host: false
  },
  roomId: "",
  joined: false
})
const msg = ref("")
const chatHistory = ref<any[]>([])
const chatBox = ref()
const scroller = ref()

const joinRoom = () => {
  if (config.roomId.trim().length === 0 || config.user.username.trim().length === 0) return
  $socket.emit("join", config.roomId)
  $socket.emit("message", {
    type: "hello",
    to: config.roomId,
    user: config.user,
    message: "Joined"
  })
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
        nextTick(() => {
          chatBox.value.scrollTop = chatBox.value.scrollHeight
        })
        break
      default:
        break
    }
  })

  $socket.on("joined", (l) => {
    if (l === 1) config.user.host = true
    config.joined = true
  })

  $socket.on("connect", () => {
    connected.value = $socket.connected
    config.user.id = $socket.id
    if (config.joined) {
      $socket.emit("join", config.roomId)
      $socket.emit("message", {
        type: "hello",
        to: config.roomId,
        user: config.user,
        message: "Joined"
      })
    }
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

watch(chatBox, () => {
  if (chatBox.value) {
    scroller.value = useScroll(chatBox, {
      behavior: "smooth"
    })
  }
})
</script>

<template>
  <div class="mt-24 px-6">
    <p v-if="!connected">Connecting...</p>
    <div class="flex w-fit flex-col gap-2" v-else>
      <p>Connected: {{ connected }}</p>
      <p>ID: {{ config.user.id }}</p>
      <p>Host: {{ config.user.host }}</p>
      <FormInput
        type="text"
        placeholder="general-chat"
        v-model="config.roomId"
        :disabled="config.joined"
        title="Room ID"
        variant="general"
      />
      <div class="flex items-center">
        <FormInput
          type="text"
          placeholder="Batman"
          v-model="config.user.username"
          :disabled="config.joined"
          title="Nickname"
          variant="general"
        />
        <button class="ml-2 mt-6" @click="config.user.username = getRandomCharacter()">
          <Icon
            class="h-8 w-8 text-gray-400 transition-all hover:rotate-45 hover:text-gray-200"
            name="mdi:dice-5"
          />
        </button>
      </div>

      <button
        v-if="!config.joined"
        :disabled="config.roomId.trim().length === 0 || config.user.username.trim().length === 0"
        class="rounded border border-gray-400 px-4 py-2 text-sm font-bold uppercase text-white disabled:opacity-40"
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
    <div v-if="config.joined">
      <div class="flex items-center justify-center gap-x-4">
        <div class="h-[800px] w-full rounded-2xl bg-black xl:aspect-video xl:w-auto"></div>
        <div
          class="relative flex h-[800px] max-h-[800px] w-full max-w-md flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 p-6"
        >
          <div class="relative -mr-4 mb-4 space-y-2 overflow-y-scroll" ref="chatBox">
            <Transition
              enter-active-class="transition ease-out duration-300"
              enter-from-class="transform translate-y-full"
              enter-to-class="transform translate-y-0"
              leave-active-class="transition ease-in duration-300"
              leave-from-class="transform translate-y-0"
              leave-to-class="transform translate-y-full"
            >
              <button
                @click="scroller.y = 9999999"
                v-if="!scroller?.arrivedState?.bottom"
                class="sticky inset-0 top-[calc(100%-40px)] h-10 w-full rounded-tl-2xl rounded-tr-2xl bg-gray-800 font-semibold uppercase tracking-tight transition-all hover:bg-gray-700"
              >
                go to bottom
              </button>
            </Transition>
            <div
              class="flex items-center gap-x-4 rounded py-2 hover:bg-gray-800"
              v-for="msg in chatHistory"
            >
              <Avatar :username="msg.user.id" class="h-12 w-12" />
              <div class="flex flex-col">
                <div>
                  <span class="mr-2 font-semibold tracking-tight text-white">{{
                    msg?.user?.username
                  }}</span>
                  <span
                    class="mr-1 inline-block w-12 rounded bg-gray-800 text-center text-sm font-semibold text-yellow-200"
                    >{{ msg.type }}</span
                  >
                  <span
                    v-if="msg.user.host"
                    class="inline-block w-12 rounded bg-gray-800 text-center text-sm font-semibold text-yellow-200"
                    >host</span
                  >
                </div>
                <div class="text text-gray-400">{{ msg?.message }}</div>
              </div>
            </div>
          </div>
          <div class="flex items-end">
            <FormInput
              type="text"
              class="w-full"
              variant="general"
              v-model="msg"
              placeholder="Type your message here..."
              :disabled="!connected"
              @keyup.enter="sendMsg"
            />
            <button
              class="ml-2 h-10 rounded border border-gray-400 px-4 text-sm font-bold uppercase text-white"
              @click="sendMsg"
            >
              send
            </button>
          </div>
          <Transition name="fade">
            <div
              v-if="!connected"
              class="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
            >
              <div class="flex flex-col items-center gap-2">
                <Icon class="h-12 w-12 text-gray-400" name="mdi:cloud-off-outline" />
                <p class="text-gray-400">You are offline</p>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>
