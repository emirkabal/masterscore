<script setup lang="ts">
import { useScroll } from "@vueuse/core"
import { getRandomCharacter } from "~/utils/functions"
const { $socket, $event } = useNuxtApp()

const connected = ref(false)

interface SocketUser {
  id: string
  username: string
  host: boolean
}

const config = reactive({
  user: {
    id: "user",
    username: "",
    host: false
  } as SocketUser,
  roomId: "",
  joined: false,
  player: {
    time: 0
  }
})
const users = ref<SocketUser[]>([])

const msg = ref("")
const chatHistory = ref<any[]>([])
const chatBox = ref()
const scroller = ref()
const currentId = ref()

const data = ref()

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
  const message = {
    type: "chat",
    to: config.roomId,
    user: config.user,
    message: msg.value
  }
  $socket.emit("message", message)
  chatHistory.value.push(message)
  nextTick(() => (chatBox.value.scrollTop = chatBox.value.scrollHeight))
  msg.value = ""
}

onMounted(() => {
  $socket.on("message", (d) => {
    if ((d.recipent && d.recipent !== config.user.id) || d.user.id === config.user.id) return
    if (d.type === "hello" || d.type === "chat" || d.type === "entertainment") {
      chatHistory.value.push(d)
      nextTick(() => (chatBox.value.scrollTop = chatBox.value.scrollHeight))
    }
    switch (d.type) {
      case "hello":
        if (config.user.host) {
          if (data.value)
            $socket.emit("message", {
              type: "entertainment",
              to: config.roomId,
              recipent: d.user.id,
              user: config.user,
              message: "Changed entertainment",
              data: data.value
            })
          $socket.emit("message", {
            type: "users",
            to: config.roomId,
            recipent: d.user.id,
            user: config.user,
            message: users.value
          })
        }
        break
      case "users":
        if (config.user.host) return
        users.value = d.message
        if (!users.value.map((e) => e.id).includes(config.user.id)) {
          users.value.push(config.user)
          if (!users.value.filter((e) => e.host).length) {
            users.value[0].host = true
            $socket.emit("message", {
              type: "users",
              to: config.roomId,
              user: config.user,
              message: users.value
            })
          }
        }
        break
      case "entertainment":
        data.value = null
        nextTick(() => {
          data.value = d.data
        })
        break
      case "player":
        if (config.player.time === d.data.time && d.data.type === "seek") return
        config.player.time = d.data.time
        $event("core:player", {
          paused: d.data.type === "pause",
          time: d.data.time
        })
        break
      default:
        break
    }
  })

  $socket.on("joined", (l) => {
    if (l === 1) config.user.host = true
    config.joined = true
    users.value.push(config.user)
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

const updatePlayer = (e: { time: number; type: string }) => {
  config.player.time = e.time
  $socket.emit("message", {
    type: "player",
    to: config.roomId,
    user: config.user,
    data: e
  })
}

watch(chatBox, () => {
  if (chatBox.value) {
    scroller.value = useScroll(chatBox, {
      behavior: "smooth"
    })
  }
})

watch(data, () => {
  if (data.value && currentId.value !== data.value.playlistId) {
    currentId.value = data.value.playlistId
    $socket.emit("message", {
      type: "entertainment",
      to: config.roomId,
      user: config.user,
      message: `I'm watching ${data.value.title}`,
      data: data.value
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
      <p v-if="users?.length">Users: {{ users.map((e) => e.username) }}</p>
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
    </div>
    <div v-if="config.joined" class="container mx-auto my-24">
      <div class="mb-4 flex items-center justify-between">
        <h1 class="text-2xl font-semibold tracking-tight">
          {{ data?.title || "İçerik bekleniyor..." }}
        </h1>
        <div class="flex items-center gap-x-2">
          <button class="px-4 py-2 text-sm">
            <Icon class="h-6 w-6 text-gray-400" name="mdi:link-variant" />
            Copy Invite Link
          </button>
          <button
            class="rounded border border-gray-400 px-4 py-2 text-sm font-bold uppercase text-white"
            @click="leaveRoom"
          >
            leave room
          </button>
        </div>
      </div>
      <div class="mx-auto flex items-center gap-x-4">
        <div class="flex h-[720px] w-full items-center justify-center rounded-2xl bg-gray-900">
          <CorePlayer
            v-if="data"
            :title="data.title"
            :poster="'-'"
            :backdrop="'-'"
            :tmdbId="data.id"
            :type="data.localData.type"
            :playlistId="data.playlistId"
            @update="updatePlayer"
          />
          <Logo class="text-center text-4xl" v-else />
        </div>
        <div
          class="relative flex h-[720px] max-h-[720px] w-full max-w-md flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 pb-6 pt-4"
        >
          <div class="relative">
            <div class="mr-1 max-h-[620px] space-y-2 overflow-y-scroll pr-1" ref="chatBox">
              <div
                class="flex items-center gap-x-4 px-6 py-2 hover:bg-gray-800"
                v-for="msg in chatHistory"
              >
                <Avatar :username="msg.user.id" class="h-12 w-12" />
                <div class="flex flex-col">
                  <div class="flex gap-x-2">
                    <span class="line-clamp-1 break-all font-semibold tracking-tight text-white">{{
                      msg?.user?.username
                    }}</span>
                    <span
                      class="inline-block rounded bg-neutral-800 px-2 text-center text-sm font-semibold text-yellow-200"
                      >{{ msg.type }}</span
                    >
                    <span
                      v-if="msg.user.host"
                      class="inline-block rounded bg-neutral-800 px-2 text-center text-sm font-semibold text-yellow-200"
                      >host</span
                    >
                  </div>
                  <div class="text break-all text-gray-300">{{ msg?.message }}</div>
                </div>
              </div>
            </div>
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
                class="absolute bottom-0 left-0 z-0 h-10 w-1/2 translate-x-1/2 rounded-tl-2xl rounded-tr-2xl bg-gray-800 px-4 font-semibold uppercase tracking-tight transition-all hover:bg-gray-700"
              >
                go to bottom
              </button>
            </Transition>
          </div>
          <div class="z-10 flex items-center !bg-gray-900 px-6 pt-4">
            <FormInput
              type="text"
              class="w-full"
              variant="general"
              v-model="msg"
              placeholder="Type your message here..."
              :disabled="!connected"
              @keyup.enter="sendMsg"
            />
            <button class="h-10 pl-4 text-sm font-bold uppercase text-white" @click="sendMsg">
              <Icon
                class="h-6 w-6 text-gray-400"
                :class="{
                  '!text-blue-500': msg.trim().length > 0
                }"
                name="ic:round-send"
              />
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
      <div class="mt-4">
        <PartySelector
          @handle="
            (_) => {
              data = null
              data = _
            }
          "
        />
      </div>
    </div>
  </div>
</template>
