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
const preview = ref(false)

const submit = async (e) => {
  e.preventDefault()
  loading.value = true
  error.value = null
  const data = await $fetch("/api/users/me", {
    method: "PATCH",
    headers: generateHeaders(),
    body: JSON.stringify({
      about: about.value,
      banner: banner.value
    })
  })

  if (data.status === 200) {
    user.about = about.value
    user.banner = banner.value
  } else {
    about.value = user.about
    banner.value = user.banner
    error.value = data.message
  }

  loading.value = false
}
</script>
<template>
  <div class="container m-auto mt-12">
    <h1 class="border-b dark:border-zinc-900 pb-4 mb-8 text-2xl font-bold">
      Edit Profile
    </h1>

    <div class="flex justify-center" v-if="loading">
      <Spinner color="#000" />
    </div>
    <form v-else @submit="submit" class="space-y-2">
      <div class="border-b dark:border-zinc-900 pb-4 space-y-2">
        <span class="text-xl font-bold">About</span>
        <button
          type="button"
          @click="preview = !preview"
          class="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded ml-2 text-white"
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

      <div v-if="error" class="text-red-500 text-sm">
        {{ error }}
      </div>
      <div class="flex justify-end gap-4">
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
    </form>
  </div>
</template>
