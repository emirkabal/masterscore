<script setup>
import { useUserStore } from "~/store/user"
definePageMeta({
  middleware: ["auth"]
})

const { user } = useUserStore()

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
  return new Date(user.latestUsernameChange).getTime() + 604800000 < Date.now()
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
  <div class="container m-auto mt-12 px-4 md:px-0">
    <h1 class="border-b dark:border-zinc-900 pb-4 mb-8 text-2xl font-bold">
      Edit Profile
    </h1>

    <div class="flex justify-center" v-if="loading">
      <Spinner color="#000" />
    </div>
    <form v-else @submit="submit" class="space-y-2">
      <div class="border-b dark:border-zinc-900 pb-4 space-y-2">
        <div
          class="pb-4 border-b mb-4 dark:border-zinc-800 flex items-center gap-4"
        >
          <div class="space-y-2">
            <span class="text-xl font-bold">Username</span>
            <div class="flex">
              <span
                class="inline-flex items-center px-3 text-sm dark:bg-zinc-900 dark:border-zinc-800 bg-gray-100 border border-gray-300 text-gray-500"
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
                class="w-full form-input resize-none dark:bg-zinc-900 dark:border-zinc-800 disabled:opacity-50"
                type="text"
              />
            </div>
            <div class="text-gray-500 dark:text-gray-300 text-sm">
              You can change your username once every 7 days.
            </div>
          </div>
          <Avatar :username="username || user.username" class="w-16 h-16" />
        </div>
        <span class="text-xl font-bold">About</span>
        <button
          type="button"
          @click="preview = !preview"
          class="bg-blue-700 hover:bg-blue-600 px-2 py-1 rounded ml-2 text-white"
        >
          {{ preview ? "Edit" : "Preview" }}
        </button>
        <p
          v-if="preview"
          class="text-gray-500 dark:text-gray-100 break-words whitespace-pre-wrap truncate line-clamp-5 max-w-6xl"
        >
          {{ about }}
        </p>
        <div v-else class="relative">
          <textarea
            :value="about"
            :maxlength="512"
            @input="(e) => (about = e.target.value)"
            class="w-full h-36 resize-none dark:bg-zinc-900 dark:border-zinc-800"
          >
          </textarea>
          <div
            class="text-gray-500 dark:text-gray-300 text-sm absolute z-10 bottom-0 right-0 m-4"
          >
            {{ about?.length || 0 }} / 512
          </div>
        </div>
      </div>

      <div class="pb-4 space-y-2">
        <span class="text-xl font-bold"
          >Banner URL
          <span class="text-gray-400 dark:text-gray-300 text-base"
            >(Imgur is recommended)</span
          ></span
        >

        <input
          :value="banner"
          @input="(e) => (banner = e.target.value)"
          :maxlength="128"
          placeholder="https://i.imgur.com/BiwjCWt.jpg"
          class="w-full form-input resize-none dark:bg-zinc-900 dark:border-zinc-800"
          type="text"
        />
      </div>

      <div class="flex justify-between items-center gap-4">
        <div
          class="text-red-500 text-sm"
          :class="{
            'opacity-0': !error,
            'opacity-100': error
          }"
        >
          {{ error }}
        </div>
        <div class="gap-2 flex">
          <router-link
            to="/users/@me"
            class="px-4 py-2 rounded hover:bg-gray-100 bg-gray-50 text-black font-bold transition-colors"
            >Back to profile</router-link
          >
          <button
            class="px-4 py-2 rounded hover:bg-blue-600 bg-blue-700 text-white font-bold transition-colors"
          >
            Update Profile
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
