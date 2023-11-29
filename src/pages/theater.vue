<script setup lang="ts">
import { useScroll, useEventBus, useIntervalFn, useClipboard, useStorage } from "@vueuse/core"
import { useUserStore } from "~/store/user"
import { getRandomCharacter } from "~/utils/functions"
const { $socket } = useNuxtApp()

const { isLoggedIn, user } = useUserStore()
const route = useRoute()
const router = useRouter()

const flag = useStorage("debugMode", false)
const { copy } = useClipboard()
const bus = useEventBus<{
  time?: number
  type?: string
}>("player")

const connected = ref(false)

interface SocketUser {
  id: string
  username: string
  avatar?: string
  verified?: boolean
  host: boolean
  isPublic: boolean
  player: {
    time: number
    paused: boolean
    updatedAt: number
  }
}

const config = reactive({
  user: {
    id: "user",
    username: getRandomCharacter(),
    host: false,
    player: {
      time: 0,
      paused: true,
      updatedAt: Date.now()
    }
  } as SocketUser,
  roomId: route.query.room ? (route.query.room as string) : "",
  joined: false,
  joining: false,
  autoSync: true,
  showUsers: false
})
const users = ref<SocketUser[]>([])

const msg = ref("")
const chatHistory = ref<any[]>([])
const chatBox = ref()
const scroller = ref()
const currentId = ref()

watch(config, () => {
  router.push({
    path: "/theater",
    query: { room: config.roomId || undefined }
  })
})

const data = ref()

const copyLink = () => {
  copy(window.location.href)
}

const joinRoom = (guest = true) => {
  if (config.joined || config.joining) return
  if (!guest && user) {
    config.user.username = user.username
    config.user.verified = user.verified
    if (user.avatar) config.user.avatar = user.avatar
    config.user.isPublic = true
  }

  if (config.roomId.trim().length === 0) {
    config.roomId = Math.random().toString(36).substring(7)
  }

  if (config.roomId.trim().length === 0 || config.user.username.trim().length === 0) return
  $socket.emit("join", config.roomId)
  $socket.emit("message", {
    type: "hello",
    to: config.roomId,
    user: config.user
  })
}

const leaveRoom = () => {
  if (!config.joined) return
  $socket.emit("leave", config.roomId)
  config.joined = false
  config.user.host = false
  config.user.username = getRandomCharacter()
  config.user.isPublic = false
  config.user.avatar = undefined
  config.user.verified = false
  config.roomId = ""
  chatHistory.value = []
  users.value = []
  if (!$socket.connected) $socket.connect()
}

const sendMsg = () => {
  if (msg.value.trim().length === 0) return
  // if (msg.value === "/clear") {
  //   chatHistory.value = []
  //   msg.value = ""
  //   sendChatMessage("Chat cleared")
  //   return
  // }
  // if (msg.value === "/clear") {
  //   chatHistory.value = []
  //   msg.value = ""
  //   sendChatMessage("Chat cleared")
  //   return
  // }
  if (msg.value.startsWith("/")) {
    const cmd = msg.value.split(" ")[0]
    switch (cmd) {
      case "/clear":
        chatHistory.value = []
        sendChatMessage("Chat cleared")
        break
      case "/nick":
        const nick = msg.value.split(" ")[1]
        if (nick) {
          config.user.username = nick
          sendChatMessage(`Your nickname changed to ${nick}`)
        } else {
          sendChatMessage(`Your nickname is ${config.user.username}`)
        }
        break
      case "/dc":
        $socket.disconnect()
        setTimeout(() => {
          $socket.connect()
        }, 1000)
        break
      default:
        sendChatMessage("Unknown command")
        break
    }
    msg.value = ""

    return
  }

  const message = {
    type: "chat",
    to: config.roomId,
    user: config.user,
    message: msg.value
  }
  $socket.emit("message", message)
  chatHistory.value.push(message)
  if (chatBox.value) nextTick(() => (chatBox.value.scrollTop = chatBox.value?.scrollHeight))
  msg.value = ""
}

const sendChatMessage = (message: string) => {
  if (message.trim().length === 0) return
  const msg = {
    user: {
      id: "system"
    },
    message
  }
  chatHistory.value.push(msg)
  if (chatBox.value) nextTick(() => (chatBox.value.scrollTop = chatBox.value?.scrollHeight))
}

onMounted(() => {
  $socket.on("message", (d) => {
    if ((d.recipent && d.recipent !== config.user.id) || d.user.id === config.user.id) return
    if ("message" in d) {
      chatHistory.value.push(d)
      if (chatBox.value) nextTick(() => (chatBox.value.scrollTop = chatBox.value?.scrollHeight))
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
              data: data.value
            })
          users.value.push(d.user)
          $socket.emit("message", {
            type: "users",
            to: config.roomId,
            user: config.user,
            data: users.value
          })
        }
        sendChatMessage(`${d.user.username} joined the room`)
        break
      case "users":
        users.value = d.data
        break
      case "entertainment":
        if (d.data.playlistId === currentId.value) return
        data.value = null
        setTimeout(() => {
          data.value = d.data
        }, 10)
        break
      case "user_update":
        const found = users.value.findIndex((e) => e.id === d.user.id)
        if (found) users.value[found] = d.user
        if (config.user.host) shareUpdates()
        break

      case "player_update":
        if (d.data.type === "play") playAtTime(d.data.time)
        else if (d.data.type === "pause") pause(d.data.time)
        else if (d.data.type === "play-force") playAtTime(d.data.time, true)
        if (d.recipent) {
          sendChatMessage(`The host syncing player with you.`)
        }

        if (d.data.type !== "sync") {
          setTimeout(() => {
            $socket.emit("message", {
              type: "player_update",
              to: config.roomId,
              user: config.user,
              data: {
                time: config.user.player.time,
                type: "sync"
              }
            })
          }, 500)
        }

        const f = users.value.findIndex((e) => e.id === d.user.id)
        if (f) users.value[f] = d.user
        if (config.user.host) shareUpdates()
        break
      default:
        break
    }
  })

  $socket.on("joined", (l) => {
    config.joining = false
    if (l === 1 && !config.user.isPublic && !config.user.verified) {
      sendChatMessage("You removed from the room because you are not verified")
      $socket.disconnect()
    } else if (l === 1) {
      config.user.host = true
      sendChatMessage(`You are the host of the room`)
    } else {
      sendChatMessage(`You joined the room`)
    }
    config.joined = true
    users.value.push(config.user)
  })

  $socket.on("left", (u) => {
    const user = users.value.find((e) => e.id === u.id)
    sendChatMessage(`${user?.username} left the room`)
    users.value = users.value.filter((e) => e.id !== u.id)
    if (users.value[0].id === config.user.id && !config.user.host) {
      if (!config.user.isPublic && !config.user.verified) {
        sendChatMessage("You removed from the room because you are not verified")
        $socket.disconnect()
        return
      }
      config.user.host = true
      users.value[0].host = true
      sendChatMessage(`You are the host of the room`)
      shareUpdates()
    }
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
    users.value = []
    connected.value = $socket.connected
    sendChatMessage("You are disconnected from the room")
  })

  $socket.connect()
})

onUnmounted(() => {
  leaveRoom()
  $socket.disconnect()
  $socket.off("connect")
  $socket.off("disconnect")
  $socket.off("message")
  $socket.off("joined")
  $socket.off("left")
})

const syncPlayers = () => {
  if (users.value.length < 2 || frozen.value || config.user.player.paused) return
  const sorted = [...users.value]
    .filter((e) => e.id !== config.user.id)
    .sort((a, b) => {
      return a.player.time - b.player.time
    })
  for (let i = 0; i < sorted.length; i++) {
    const u = sorted[i]
    const diff = config.user.player.time - u.player.time
    if (diff > 2.3 || diff < -2.3) {
      $socket.emit("message", {
        type: "player_update",
        to: config.roomId,
        recipent: u.id,
        user: config.user,
        data: {
          time: config.user.player.time,
          type: "play-force"
        }
      })
      sendChatMessage(`The host syncing player with ${u.username}`)
    }
  }
}

useIntervalFn(() => {
  if (!config.user.host || !config.autoSync) return
  syncPlayers()
}, 1000)

useIntervalFn(() => {
  users.value.forEach((e) => {
    if (!e.player.paused) e.player.time = e.player.time + 0.2
  })
}, 200)

function shareUpdates() {
  if (config.user.host) {
    return $socket.emit("message", {
      type: "users",
      to: config.roomId,
      user: config.user,
      data: users.value
    })
  }
  $socket.emit("message", {
    type: "user_update",
    to: config.roomId,
    user: config.user
  })
}

const frozen = ref(false)

function freezeControls() {
  frozen.value = true
  setTimeout(() => {
    frozen.value = false
  }, 500)
}

function pause(time?: number) {
  if (frozen.value || config.user.player.paused) return
  else {
    freezeControls()
    config.user.player.paused = true
    bus.emit({
      time,
      type: "pause"
    })
  }
  shareUpdates()
}

function playAtTime(time: number, force = false) {
  if (!config.user.player.paused && !force) return
  else {
    config.user.player.paused = false
    bus.emit({
      time,
      type: "play"
    })
  }
  shareUpdates()
}

const handlePlayEvent = () => {
  if (!config.user.player.paused) return
  config.user.player.paused = false
  $socket.emit("message", {
    type: "player_update",
    to: config.roomId,
    user: config.user,
    data: {
      time: config.user.player.time,
      type: "play"
    }
  })
}

const handlePauseEvent = () => {
  if (config.user.player.paused) return
  config.user.player.paused = true
  $socket.emit("message", {
    type: "player_update",
    to: config.roomId,
    user: config.user,
    data: {
      time: config.user.player.time,
      type: "pause"
    }
  })
}

const updatePlayer = (e: { time?: number; type: string }) => {
  config.user.player.updatedAt = Date.now()
  if (e.time) {
    config.user.player.time = e.time
  }
  if (e.type === "play") handlePlayEvent()
  else if (e.type === "pause") handlePauseEvent()
}

const handleSelector = (_: any) => {
  data.value = null
  setTimeout(() => {
    data.value = _
  }, 100)
  $socket.emit("message", {
    type: "entertainment",
    to: config.roomId,
    user: config.user,
    message: `Changed to ${_.title || _.name}`,
    data: _
  })
}

watch(chatBox, () => {
  if (chatBox.value) {
    scroller.value = useScroll(chatBox, {
      behavior: "smooth"
    })
  }
})
</script>

<template>
  <div class="mt-36 px-6">
    <div v-if="!config.joined" class="flex flex-col items-center justify-center">
      <div class="flex items-center gap-x-2">
        <Icon v-if="connected" class="h-6 w-6 text-gray-400" name="mdi:cloud-check-outline" />
        <Icon v-else class="h-6 w-6 animate-spin text-gray-400" name="mdi:loading" />
        <p class="text-gray-400">
          {{ connected ? "Connected" : "Connecting" }}
        </p>
      </div>
      <div class="h-[80vh]" v-if="connected">
        <h1 class="text-center text-5xl font-semibold tracking-tight">Select profile</h1>
        <div class="flex h-full items-center justify-center gap-x-12">
          <button
            v-if="isLoggedIn && user"
            class="flex flex-col items-center gap-6 hover:opacity-75"
            @click="joinRoom(false)"
          >
            <Avatar
              :username="$socket.id.substring(0, 5)"
              :avatar="user?.avatar"
              :verified="user?.verified"
              class="h-32 w-32"
            />
            <span class="text-center text-xl font-semibold tracking-tight">
              {{ user.username }}
            </span>
          </button>
          <button class="flex flex-col items-center gap-6 hover:opacity-75" @click="joinRoom(true)">
            <Avatar class="h-32 w-32" :username="config.user.id" />
            <span class="text-center text-xl font-semibold tracking-tight">{{
              config.user.username
            }}</span>
          </button>
        </div>
      </div>
    </div>
    <div v-else class="container mx-auto my-24">
      <div class="mb-4 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight">
            {{ data?.title || data?.name || "İçerik bekleniyor..." }}
          </h1>
          <span class="text-gray-300">
            {{ $moment.duration(config.user.player.time, "seconds").format("hh:mm:ss") }}
          </span>
        </div>
        <div class="flex items-center gap-x-2">
          <button class="px-4 py-2 text-sm" @click="copyLink">
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
            :title="data.title || data.name"
            :poster="'-'"
            :backdrop="'-'"
            :tmdbId="data.id"
            :type="data.localData.type"
            :playlistId="data.playlistId"
            :disable-history="true"
            @update="updatePlayer"
          />
          <Logo class="text-center text-4xl" v-else />
        </div>
        <div
          class="relative flex h-[720px] max-h-[720px] w-full max-w-md flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 pb-6 pt-4"
        >
          <Transition name="fade">
            <button
              class="absolute right-0 top-0 z-20 m-2 !mr-6 flex items-center gap-x-2 rounded-full bg-gray-800/60 px-2 py-1 text-sm font-semibold hover:bg-gray-800"
              @click="config.showUsers = !config.showUsers"
              v-if="!config.showUsers"
            >
              {{ users.length }}
              <Icon class="h-6 w-6 text-gray-200" name="lucide:users-2" />
            </button>
          </Transition>
          <Transition
            enter-active-class="transition ease-out duration-300"
            enter-from-class="transform -translate-y-full"
            enter-to-class="transform translate-y-0"
            leave-active-class="transition ease-in duration-300"
            leave-from-class="transform translate-y-0"
            leave-to-class="transform -translate-y-full"
          >
            <div
              v-if="config.showUsers"
              class="absolute left-0 top-0 z-10 h-[300px] w-full overflow-hidden rounded-bl-3xl rounded-br-3xl bg-gray-900 py-2 shadow-2xl"
            >
              <div class="flex items-center justify-between px-6 pb-2">
                <h1 class="text-xl font-semibold tracking-tight">Users</h1>
                <button
                  class="flex items-center gap-x-2 rounded-full bg-gray-800/60 px-2 py-1 text-sm font-semibold hover:bg-gray-800"
                  @click="config.showUsers = !config.showUsers"
                >
                  {{ users.length }}
                  <Icon class="h-6 w-6 text-gray-200" name="lucide:users-2" />
                </button>
              </div>
              <div class="mr-1 flex h-56 flex-col gap-y-2 overflow-y-scroll px-6 py-2 pr-1">
                <div v-for="u in users" class="flex w-full items-center gap-x-4">
                  <Avatar
                    :username="u.id.substring(0, 5)"
                    :avatar="u.avatar"
                    :verified="u.verified"
                    :minimize="true"
                    class="h-12 w-12"
                  />
                  <div class="flex w-full flex-col">
                    <div class="flex items-center gap-x-2">
                      <span
                        class="line-clamp-1 max-w-[128px] break-words font-semibold tracking-tight"
                        >{{ u.username }}</span
                      >
                      <span v-if="u.id === config.user.id" class="text-sm text-gray-300">
                        you
                      </span>
                    </div>
                    <span class="text-sm text-gray-300">
                      {{ u.player.paused ? "Paused" : "Playing" }}:
                      {{ $moment.duration(u.player.time, "seconds").format("hh:mm:ss") }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
          <div class="relative">
            <!-- Chat -->
            <div class="mr-1 max-h-[620px] overflow-y-scroll pr-1" ref="chatBox">
              <div
                class="flex items-start gap-x-4 px-6 py-2 hover:bg-gray-800"
                v-for="(msg, index) in chatHistory"
                :class="{
                  '!py-0': chatHistory[index - 1]?.user?.id === msg.user.id,
                  '!pb-0': chatHistory[index + 1]?.user?.id === msg.user.id
                }"
              >
                <div
                  v-if="chatHistory[chatHistory.indexOf(msg) - 1]?.user?.id === msg.user.id"
                  class="h-0.5 w-12 flex-shrink-0"
                  :class="{
                    hidden: msg.user.id === 'system'
                  }"
                ></div>
                <NuxtLink
                  v-else
                  :to="msg.user?.isPublic ? `/users/@${msg.user.username}` : undefined"
                  :class="{
                    hidden: msg.user.id === 'system'
                  }"
                >
                  <Avatar
                    :username="msg?.user?.id?.substring(0, 5) || 'm'"
                    :avatar="msg?.user?.avatar"
                    :verified="msg?.user?.verified"
                    :minimize="true"
                    class="h-12 w-12"
                  />
                </NuxtLink>
                <div class="flex w-[calc(100%-3rem)] flex-col">
                  <div
                    v-if="chatHistory[chatHistory.indexOf(msg) - 1]?.user?.id !== msg.user.id"
                    class="flex items-center gap-x-2 break-all font-semibold tracking-tight text-white"
                  >
                    <span class="line-clamp-1">
                      {{ msg?.user?.username || "System" }}
                    </span>
                    <Icon
                      v-if="msg.user?.host"
                      v-tooltip="{
                        content: 'Host',
                        placement: 'bottom'
                      }"
                      class="inline-block h-5 w-5 flex-shrink-0 text-yellow-400"
                      name="fa6-solid:masks-theater"
                    />
                  </div>
                  <div class="break-words text-gray-300">
                    {{ msg?.message }}
                  </div>
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
                class="absolute bottom-2 left-1/2 z-0 -translate-x-1/2 space-x-2 rounded-full bg-gray-800/80 px-4 py-1 text-sm font-semibold uppercase tracking-tight text-white/80 transition-all hover:bg-gray-700"
              >
                <Icon
                  class="h-6 w-6 text-gray-400"
                  name="material-symbols:keyboard-arrow-down-rounded"
                />
                <span>{{ $t("go-to-bottom") }}</span>
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
      <div v-if="config.user.host && flag">
        <label for="autosynccheck">
          Auto Sync
          <input id="autosynccheck" type="checkbox" v-model="config.autoSync" />
        </label>
      </div>
      <div class="mt-4 pb-20" v-if="config.user?.isPublic && config.user?.verified">
        <TheaterSelector @handle="handleSelector" />
      </div>
    </div>
  </div>
</template>
