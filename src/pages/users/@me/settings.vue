<script setup>
import { useUserStore } from "~/store/user"
import { Switch } from "@headlessui/vue"
import { useStorage } from "@vueuse/core"
definePageMeta({
  middleware: ["auth"]
})

const { user } = useUserStore()
const flag = useStorage("debugMode", false)

const loading = ref(false)
const error = ref(null)
const about = ref(user.about)
const banner = ref(user.banner)
const username = ref("")
const preview = ref(false)

watch(username, (newValue) => {
  username.value = username.value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "")
    .replace(/^(.{16}).*$/, "$1")
})

const isUsernameChangeAvailable = computed(() => {
  return (
    !user.latestUsernameChange ||
    new Date(user.latestUsernameChange).getTime() + 604800000 < Date.now()
  )
})

const submit = async (e) => {
  e.preventDefault()
  loading.value = true
  error.value = null
  const data = await $fetch("/api/users/me", {
    method: "PATCH",
    headers: generateHeaders(),
    body: JSON.stringify({
      username: username.value,
      about: about.value,
      banner: banner.value
    })
  })

  if (data.status === 200) {
    user.about = about.value
    user.banner = banner.value
    if (username.value.length > 0) {
      user.username = username.value
      user.latestUsernameChange = Date.now()
    }
  } else {
    about.value = user.about
    banner.value = user.banner
    error.value = data.message
  }

  username.value = ""
  loading.value = false
}
</script>
<template>
  <div class="container mx-auto my-16 px-4">
    <h1 class="mb-8 border-b pb-4 text-2xl font-bold dark:border-zinc-900">
      Settings
    </h1>
    <div class="px-2">
      <p
        class="mb-4 border-b px-2 py-4 font-maven font-semibold dark:border-zinc-900"
      >
        Edit Profile
      </p>
      <div class="flex justify-center" v-if="loading">
        <Spinner color="#000" />
      </div>
      <form v-else @submit="submit" class="space-y-2">
        <div class="space-y-2 border-b pb-4 dark:border-zinc-900">
          <div
            class="mb-4 flex items-center gap-4 border-b pb-4 dark:border-zinc-800"
          >
            <div class="space-y-2">
              <span class="text-xl font-bold">Username</span>
              <div class="flex">
                <span
                  class="inline-flex items-center border border-gray-300 bg-gray-100 px-3 text-sm text-gray-500 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  @
                </span>
                <input
                  :value="username"
                  @input="
                    (e) =>
                      (username = e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]/g, ''))
                  "
                  :maxlength="16"
                  :placeholder="user.username"
                  :disabled="!isUsernameChangeAvailable"
                  class="form-input w-full resize-none disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900"
                  type="text"
                />
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-300">
                You can change your username once every 7 days.
              </div>
            </div>
            <Avatar :username="username || user.username" class="h-16 w-16" />
          </div>
          <span class="text-xl font-bold">About</span>
          <button
            type="button"
            @click="preview = !preview"
            class="ml-2 rounded bg-blue-700 px-2 py-1 text-white hover:bg-blue-600"
          >
            {{ preview ? "Edit" : "Preview" }}
          </button>
          <p
            v-if="preview"
            class="max-w-6xl truncate whitespace-pre-wrap break-words text-gray-500 line-clamp-5 dark:text-gray-100"
          >
            {{ about }}
          </p>
          <div v-else class="relative">
            <textarea
              :value="about"
              :maxlength="512"
              @input="(e) => (about = e.target.value)"
              class="h-36 w-full resize-none dark:border-zinc-800 dark:bg-zinc-900"
            >
            </textarea>
            <div
              class="absolute bottom-0 right-0 z-10 m-4 text-sm text-gray-500 dark:text-gray-300"
            >
              {{ about?.length || 0 }} / 512
            </div>
          </div>
        </div>

        <div class="space-y-2 pb-4">
          <span class="text-xl font-bold"
            >Banner URL
            <span class="text-base text-gray-400 dark:text-gray-300"
              >(Imgur is recommended)</span
            ></span
          >

          <input
            :value="banner"
            @input="(e) => (banner = e.target.value)"
            :maxlength="128"
            placeholder="https://i.imgur.com/BiwjCWt.jpg"
            class="form-input w-full resize-none dark:border-zinc-800 dark:bg-zinc-900"
            type="text"
          />
        </div>

        <div class="flex items-center justify-between gap-4">
          <div
            class="text-sm text-red-500"
            :class="{
              'opacity-0': !error,
              'opacity-100': error
            }"
          >
            {{ error }}
          </div>
          <div class="flex gap-2">
            <router-link
              to="/users/@me"
              class="rounded bg-gray-50 px-4 py-2 font-bold text-black transition-colors hover:bg-gray-100"
              >Back to profile</router-link
            >
            <button
              class="rounded bg-blue-700 px-4 py-2 font-bold text-white transition-colors hover:bg-blue-600"
            >
              Update Profile
            </button>
          </div>
        </div>
      </form>
    </div>
    <div class="mt-8 px-2">
      <p
        class="mb-4 border-b px-2 py-4 font-maven font-semibold dark:border-zinc-900"
      >
        Preferences
      </p>
      <label
        class="flex cursor-pointer items-center justify-between border py-6 px-4 dark:border-zinc-900"
        for="debugMode"
      >
        <p>Debug Mode</p>
        <Switch
          id="debugMode"
          v-model="flag"
          :class="flag ? 'bg-blue-700' : 'bg-teal-700'"
          class="relative inline-flex h-[28px] w-[58px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          <span class="sr-only">Use setting</span>
          <span
            aria-hidden="true"
            :class="flag ? 'translate-x-7' : 'translate-x-0'"
            class="pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
          />
        </Switch>
      </label>
    </div>
  </div>
</template>

<style scoped>
label > p {
  @apply cursor-pointer select-none font-maven text-lg font-bold;
}
</style>
