<script setup lang="ts">
import { useScroll, useEventBus, useIntervalFn, useClipboard, useStorage } from "@vueuse/core"
import { useUserStore } from "~/store/user"
import { getRandomCharacter } from "~/utils/functions"
const { $socket, $moment } = useNuxtApp()

const { isLoggedIn, user } = useUserStore()
const route = useRoute()
const router = useRouter()

const flag = useStorage("debugMode", false)
const theaterUser = useStorage("theaterUser", {
  id: Math.random().toString(36).substring(7),
  guestName: getRandomCharacter(),
  alreadyConnectedToAnyRoom: false
})
const { copy } = useClipboard()

const bus = useEventBus<{
  time?: number
  type?: string
}>("player")

const chatBus = useEventBus<{
  scroll?: boolean
  new_message?: boolean
}>("theater-chat")

const connected = ref(false)

interface SocketUser {
  id: string
  username: string
  avatar?: string
  verified?: boolean
  host: boolean
  isPublic: boolean
  left: boolean
  lastSeen?: number
  typing?: boolean
  joinedAt: number
  player: {
    time: number
    paused: boolean
    updatedAt: number
  }
}

const config = reactive({
  user: {
    // id: $socket.id,
    id: theaterUser.value.id,
    username: theaterUser.value.guestName,
    host: false,
    left: false,
    joinedAt: Date.now(),
    typing: false,
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
  showUsers: false,
  hostWaiting: false,
  theaterMode: false
})
const users = ref<SocketUser[]>([])

const msg = ref("")
const chatHistory = shallowRef<any[]>([])

const currentId = ref()

const usersSize = computed(() => users.value.filter((e) => !e.left).length)
const typingUsers = computed(() =>
  users.value.filter((e) => e.typing && !e.left && e.id !== config.user.id)
)

watch(config, () => {
  if (config.theaterMode) {
    document.body.style.overflow = "hidden"
  } else {
    document.body.style.overflow = "auto"
  }
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
  config.user.joinedAt = Date.now()
  $socket.emit("join", [config.roomId, config.user.id])
  $socket.emit("message", {
    type: "hello",
    to: config.roomId,
    user: config.user
  })
  theaterUser.value.alreadyConnectedToAnyRoom = true
}

const leaveRoom = () => {
  if (!config.joined) return
  $socket.emit("leave", config.roomId)
  config.joined = false
  config.user.host = false
  config.user.isPublic = false
  config.user.avatar = undefined
  config.user.verified = false
  // config.roomId = ""
  chatHistory.value = []
  users.value = []
  if (!$socket.connected) $socket.connect()
  theaterUser.value.alreadyConnectedToAnyRoom = false
}

const startTyping = () => {
  if (config.user.typing) return
  config.user.typing = true
  $socket.emit("message", {
    type: "typing",
    to: config.roomId,
    user: config.user
  })
  setTimeout(() => {
    config.user.typing = false
  }, 3000)
}

const getMe = () => {
  return users.value.find((e) => e.id === config.user.id)
}

const sendMsg = async () => {
  if (msg.value.trim().length === 0) return
  if (msg.value.startsWith("/")) {
    const cmd = msg.value.split(" ")[0]
    const args = msg.value.split(" ").slice(1)
    switch (cmd) {
      case "/clear":
        chatHistory.value = []
        sendChatMessage("Chat cleared")
        break
      case "/nick":
        const nick = args.join(" ")
        if (nick?.length > 24) {
          sendChatMessage("Nickname can't be longer than 24 characters")
          break
        }
        if (nick) {
          config.user.username = nick
          sendChatMessage(`Your nickname changed to ${nick}`)
        } else {
          sendChatMessage(`Your nickname is ${config.user.username}`)
        }
        const me = getMe()
        if (me) me.username = config.user.username
        $socket.emit("message", {
          type: "nick_update",
          to: config.roomId,
          user: config.user
        })
        break
      case "/gif":
        if (!args.length) {
          sendChatMessage("Please enter a search term")
          break
        }
        msg.value = ""
        const search = args.join(" ")
        const data = await $fetch<any>(
          `https://g.tenor.com/v1/search?q=${search}&key=LIVDSRZULELA&limit=8`
        )
        if (
          data?.results?.length &&
          data.results[0]?.media?.length &&
          data.results[0]?.media[0]?.gif?.url
        ) {
          msg.value = `tenor:${data.results[0]?.media[0]?.gif?.url}`
          sendMsg()
        } else {
          sendChatMessage("No gif found")
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
    chatBus.emit({
      scroll: true
    })
    return
  }

  const message = {
    type: "chat",
    to: config.roomId,
    user: config.user,
    message: {
      content: msg.value,
      createdAt: Date.now()
    }
  }
  $socket.emit("message", message)
  chatHistory.value = [...chatHistory.value, message]

  msg.value = ""
  chatBus.emit({
    scroll: true
  })
}

const sendChatMessage = (message: string) => {
  if (message.trim().length === 0) return
  const msg = {
    user: {
      id: "system"
    },
    message: {
      content: message,
      createdAt: Date.now()
    }
  }
  chatHistory.value = [...chatHistory.value, msg]
  chatBus.emit({
    scroll: true
  })
}

onMounted(() => {
  theaterUser.value.alreadyConnectedToAnyRoom = false
  $socket.on("message", (d) => {
    if ((d.recipent && d.recipent !== config.user.id) || d.user.id === config.user.id) return
    if ("message" in d) {
      chatHistory.value = [...chatHistory.value, d]
      chatBus.emit({
        new_message: true
      })
    }
    switch (d.type) {
      case "hello":
        const returnedUser = users.value.find((e) => e.id === d.user.id)
        if (returnedUser) {
          returnedUser.left = false
          returnedUser.lastSeen = Date.now()
          returnedUser.username = d.user.username
          if (returnedUser.host) {
            config.user.host = false
            config.hostWaiting = false
            returnedUser.host = true
            $socket.emit("message", {
              type: "users",
              to: config.roomId,
              user: config.user,
              data: users.value
            })
            if (data.value) {
              $socket.emit("message", {
                type: "entertainment",
                to: config.roomId,
                recipent: d.user.id,
                user: config.user,
                data: data.value
              })
            }
            sendChatMessage(`The host is reconnected.`)
            break
          }
          sendChatMessage(`${d.user.username} reconnected to the room`)
        } else {
          users.value.push(d.user)
          sendChatMessage(`${d.user.username} joined the room`)
        }

        if (config.user.host) {
          if (data.value)
            $socket.emit("message", {
              type: "entertainment",
              to: config.roomId,
              recipent: d.user.id,
              user: config.user,
              data: data.value
            })
          $socket.emit("message", {
            type: "users",
            to: config.roomId,
            user: config.user,
            data: users.value
          })
        }
        break
      case "users":
        users.value = d.data
        const fu = users.value.find((e) => e.id === config.user.id)
        if (fu && fu.host && !config.user.host) {
          config.user.host = true
          sendChatMessage(`You are the host of the room`)
        }
        break
      case "entertainment":
        if (d.data.playlistId === currentId.value) return
        currentId.value = d.data.playlistId
        data.value = null
        setTimeout(() => {
          data.value = d.data
          pause(0)
          setTimeout(() => {
            const diff = Math.abs(d.user.player.time - config.user.player.time)
            if (diff >= 5) {
              sendChatMessage(
                `${d.user.username} jumped to ${$moment
                  .duration(d.user.player.time, "seconds")
                  .format("hh:mm:ss")}`
              )
              playAtTime(d.user.player.time)
            }
          }, 1000)
        }, 10)
        break
      case "host_update":
        users.value = d.data
        config.hostWaiting = false
        sendChatMessage(`${d.user.username} is the new host`)
        break
      case "user_update":
        const found = users.value.find((e) => e.id === d.user.id)
        if (found) {
          found.lastSeen = Date.now()
          found.left = false
          found.username = d.user.username
          found.host = d.user.host
          found.isPublic = d.user.isPublic
          found.avatar = d.user.avatar
          found.verified = d.user.verified
          found.player = d.user.player
        } else {
          users.value.push(d.user)
          sendChatMessage(`${d.user.username} joined the room`)
        }
        if (config.user.host) shareUpdates()
        break
      case "nick_update":
        const foundNick = users.value.find((e) => e.id === d.user.id)
        if (foundNick) {
          sendChatMessage(`${foundNick.username} changed nickname to ${d.user.username}`)
          foundNick.username = d.user.username
          chatHistory.value.forEach((e) => {
            if (e.user.id === d.user.id) e.user.username = d.user.username
          })
        } else users.value.push(d.user)
        break
      case "typing":
        const foundUser = users.value.find((e) => e.id === d.user.id)
        if (foundUser) foundUser.typing = true
        setTimeout(() => {
          if (foundUser) foundUser.typing = false
        }, 3000)
        break
      case "player_update":
        const diff = Math.abs(d.data.time - config.user.player.time)
        if (diff >= 5) {
          sendChatMessage(
            `${d.user.username} jumped to ${$moment
              .duration(d.data.time, "seconds")
              .format("hh:mm:ss")}`
          )
        }
        if (d.data.type === "play") playAtTime(d.data.time)
        else if (d.data.type === "pause") pause(d.data.time)
        else if (d.data.type === "play-force") playAtTime(d.data.time, true)
        if (d.recipent) sendChatMessage(`The host syncing player with you.`)

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

        const f = users.value.find((e) => e.id === d.user.id)
        if (f) f.player = d.user.player
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
      users.value = []
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
    if (!user) return
    if (u.id === config.user.id) {
      users.value = []
      $socket.emit("join", [config.roomId, config.user.id])
      $socket.emit("message", {
        type: "hello",
        to: config.roomId,
        user: config.user
      })
      return
    }
    sendChatMessage(`${user?.username} left the room`)
    user.lastSeen = Date.now()
    user.left = true
    const updateRoom = () => {
      const hostSize = users.value.filter((e) => e.host && !e.left).length
      const usersSorted = [...users.value]
        .filter((e) => !e.left)
        .sort((a, b) => {
          return a.joinedAt - b.joinedAt
        })
      if (!hostSize && usersSorted.length && usersSorted[0].id === config.user.id) {
        if (!config.user.isPublic && !config.user.verified) {
          sendChatMessage("You removed from the room because you are not verified")
          $socket.disconnect()
          users.value = []
          return
        }
        config.user.host = true
        const me = getMe()
        if (me) me.host = true
        users.value.forEach((e) => {
          if (e.id === config.user.id) e.host = true
          else e.host = false
        })
        $socket.emit("message", {
          type: "host_update",
          to: config.roomId,
          user: config.user,
          data: users.value
        })
        sendChatMessage(`You are the host of the room`)
        shareUpdates()
      }
    }
    if (user?.host) {
      config.hostWaiting = true
      sendChatMessage(`The host left the room. Waiting for new host...`)
      setTimeout(() => {
        if (config.hostWaiting) {
          config.hostWaiting = false
          updateRoom()
        }
      }, 15000)
      return
    }
    updateRoom()
  })

  $socket.on("connect", () => {
    users.value = []
    connected.value = $socket.connected
    config.user.id = theaterUser.value.id
    if (config.joined) {
      $socket.emit("join", [config.roomId, config.user.id])
      $socket.emit("message", {
        type: "hello",
        to: config.roomId,
        user: config.user
      })
      sendChatMessage("You are reconnected to the room")
    }
  })

  $socket.on("disconnect", () => {
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
  if (users.value.length < 2 || frozen.value) return
  const sorted = [...users.value]
    .filter((e) => e.id !== config.user.id)
    .sort((a, b) => {
      return a.player.time - b.player.time
    })
  for (let i = 0; i < sorted.length; i++) {
    const u = sorted[i]
    const diff = config.user.player.time - u.player.time
    if ((diff > 2.3 || diff < -2.3) && !u.left) {
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
      sendChatMessage(`You are syncing player with ${u.username}`)
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

useIntervalFn(() => {
  if (!config.joined && !theaterUser.value.alreadyConnectedToAnyRoom) return
  theaterUser.value.alreadyConnectedToAnyRoom = true
}, 100)

function shareUpdates() {
  const f = users.value.find((e) => e.id === config.user.id)
  if (f) f.player = config.user.player
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
  currentId.value = _.playlistId
  data.value = null
  setTimeout(() => {
    data.value = _
  }, 100)
  $socket.emit("message", {
    type: "entertainment",
    to: config.roomId,
    user: config.user,
    message: {
      content: `Changed entertainment to ${_.title || _.name}${
        _?.episode !== undefined ? ` S${_?.season || 1}E${_?.episode || 0}` : ``
      }`
    },
    data: _
  })
  sendChatMessage(
    `You changed entertainment to ${_.title || _.name}${
      _?.episode !== undefined ? ` S${_?.season || 1}E${_?.episode || 0}` : ``
    }`
  )
  pause(0)
}
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
      <div class="h-[80vh]" v-if="connected && !config.joining">
        <h1 class="text-center text-5xl font-semibold tracking-tight">Select profile</h1>
        <div
          class="flex h-full items-center justify-center gap-x-12"
          :class="{
            'pointer-events-none opacity-25': theaterUser.alreadyConnectedToAnyRoom
          }"
        >
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
              theaterUser.guestName
            }}</span>
          </button>
        </div>
        <div class="mx-auto -mt-24 w-fit rounded-full bg-gray-900 px-4 py-2">
          <span v-if="theaterUser.alreadyConnectedToAnyRoom">
            You are already connected to a room. Please leave the room to create/join another room.
          </span>
          <span v-else-if="!config.roomId" class="text-gray-300">Creating new room...</span>
          <span v-else class="flex items-center text-gray-300"
            ><button
              class="group mr-2 flex items-center justify-center rounded-full p-1.5 hover:bg-gray-800"
              @click="config.roomId = ''"
            >
              <Icon class="h-5 w-5 text-gray-400 group-hover:text-gray-200" name="ic:close" />
            </button>
            {{ config.roomId }}
          </span>
        </div>
      </div>
    </div>

    <!-- Room Area -->
    <div v-else class="container mx-auto my-24">
      <div class="mb-4 flex items-center justify-between">
        <div>
          <div class="flex items-center gap-x-2">
            <h1 class="text-2xl font-semibold tracking-tight">
              {{ data?.title || data?.name || "İçerik bekleniyor..." }}
            </h1>
            <div v-if="data?.episode !== undefined">
              <span class="text-gray-300">S{{ data?.season || 1 }}E{{ data?.episode || 0 }}</span>
            </div>
          </div>
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
      <div
        class="mx-auto flex items-center gap-x-4"
        :class="{
          'fixed left-0 top-0 z-50 h-full w-full !gap-x-0 bg-black': config.theaterMode
        }"
      >
        <div
          class="flex h-[720px] w-full items-center justify-center rounded-2xl bg-gray-900"
          :class="{
            'h-screen w-screen rounded-none !bg-gray-950': config.theaterMode
          }"
        >
          <CorePlayer
            v-if="data"
            :title="data.title || data.name"
            :poster="$timage(data?.poster_path, 'w1280')"
            :backdrop="$timage(data?.backdrop_path, 'w1280')"
            :tmdbId="data.id"
            :type="data.localData.type"
            :playlistId="data.playlistId"
            :disable-history="true"
            @update="updatePlayer"
            :class="{
              '!rounded-none': config.theaterMode
            }"
          />
          <Logo class="text-center text-4xl" v-else />
        </div>
        <div
          class="relative flex h-[720px] max-h-[720px] w-full max-w-md flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 pb-6 pt-4"
          :class="{
            'h-full max-h-full w-screen rounded-none': config.theaterMode
          }"
        >
          <TheaterChatUpper :config="config" :users="users" :usersSize="usersSize" />
          <TheaterChat
            v-model="msg"
            :config="config"
            :connected="connected"
            :chatHistory="chatHistory"
            :sendMsg="sendMsg"
            :startTyping="startTyping"
          />
          <Transition name="fade">
            <div v-if="typingUsers.length" class="absolute bottom-0 z-10 text-sm">
              <div class="flex items-center gap-x-2 px-6 py-2">
                <Icon class="h-6 w-6 text-gray-400" name="eos-icons:three-dots-loading" />
                <span v-if="typingUsers.length < 3" class="text-gray-300">
                  {{ typingUsers.map((e) => e.username).join(" and ") }} is typing...
                </span>
                <span v-else class="text-gray-300"> Multiple users are typing... </span>
              </div>
            </div>
          </Transition>
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
      <div>
        <label for="autosynccheck" v-if="config.user.host && flag">
          Auto Sync
          <input id="autosynccheck" type="checkbox" v-model="config.autoSync" />
        </label>
        <label
          for="theatermode"
          :class="{
            'fixed bottom-0 right-0 z-[999] text-xs': config.theaterMode
          }"
        >
          Theater Mode
          <input id="theatermode" type="checkbox" v-model="config.theaterMode" />
        </label>
      </div>
      <div class="mt-4 pb-20" v-if="config.user?.isPublic && config.user?.verified">
        <TheaterSelector @handle="handleSelector" />
      </div>
    </div>
  </div>
</template>
