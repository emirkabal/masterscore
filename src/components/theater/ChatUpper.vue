<script lang="ts" setup>
defineProps<{
  config: any
  usersSize: number
  users: any[]
}>()
</script>
<template>
  <div>
    <Transition name="fade">
      <button
        class="absolute right-0 top-0 z-20 m-2 !mr-6 flex items-center gap-x-2 rounded-full bg-gray-800/60 px-2 py-1 text-sm font-semibold hover:bg-gray-800"
        @click="config.showUsers = !config.showUsers"
        v-if="!config.showUsers"
      >
        {{ usersSize }}
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
        class="absolute left-0 top-0 z-10 h-[300px] w-full overflow-hidden rounded-bl-3xl rounded-br-3xl bg-[#0c111c] py-2 shadow-2xl"
      >
        <div class="flex items-center justify-between px-6 pb-2">
          <h1 class="text-xl font-semibold tracking-tight">Users</h1>
          <button
            class="flex items-center gap-x-2 rounded-full bg-gray-800/60 px-2 py-1 text-sm font-semibold hover:bg-gray-800"
            @click="config.showUsers = !config.showUsers"
          >
            {{ usersSize }}
            <Icon class="h-6 w-6 text-gray-200" name="lucide:users-2" />
          </button>
        </div>
        <div class="mr-1 flex h-60 flex-col gap-y-2 overflow-y-auto px-6 py-2 pr-1">
          <div v-for="u in users" class="flex w-full items-center gap-x-4">
            <Avatar
              :username="u.id"
              :avatar="u.avatar"
              :verified="u.verified"
              :minimize="true"
              class="h-12 w-12"
            />
            <div class="flex w-full flex-col">
              <div class="flex items-center gap-x-2">
                <span class="line-clamp-1 max-w-[128px] break-words font-semibold tracking-tight">{{
                  u.username
                }}</span>
                <Icon
                  v-if="u.host"
                  v-tooltip="'Host'"
                  class="inline-block h-5 w-5 flex-shrink-0 text-yellow-400"
                  name="fa6-solid:masks-theater"
                />
                <span v-if="u.id === config.user.id" class="text-sm text-gray-300"> you </span>
              </div>
              <span v-if="!u.left" class="text-sm text-gray-300">
                {{ u.player.paused ? "Paused" : "Playing" }}:
                {{ $moment.duration(u.player.time, "seconds").format("hh:mm:ss") }}
              </span>
              <span v-else class="text-sm text-red-300"> Disconnected </span>
            </div>
            <div v-if="u.typing">
              <Icon class="h-6 w-6 text-gray-400" name="eos-icons:three-dots-loading" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
