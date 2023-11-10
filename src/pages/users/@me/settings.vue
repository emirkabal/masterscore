<script setup>
import VuePictureCropper, { cropper } from "vue-picture-cropper"
import { useUserStore } from "~/store/user"
import { useStorage } from "@vueuse/core"

definePageMeta({
  middleware: ["auth"]
})
useHead({
  title: "Settings",
  titleTemplate: "%s - Masterscore"
})

const { user } = useUserStore()
const flag = useStorage("debugMode", false)

const loading = ref(false)
const error = ref(null)
const about = ref(user.about)
const banner = ref(user.banner)
const username = ref("")

const croppingImage = ref(null)
const avatar = ref(null)
const avatarHandle = ref("")

watch(username, (newValue) => {
  username.value = username.value
    .trim()
    .replace(/[^A-Za-z0-9]/g, "")
    .replace(/^(.{16}).*$/, "$1")
})

const isUsernameChangeAvailable = computed(() => {
  return (
    !user.latestUsernameChange ||
    new Date(user.latestUsernameChange).getTime() + 604800000 < Date.now()
  )
})

const uploadFiles = (e) => {
  if (!e.target.files && !e.target.files[0]) return
  const file = e.target.files[0]
  if (file.size > 1000000) {
    error.value = "File size is too big"
    return
  } else {
    error.value = null
  }
  croppingImage.value = file
  //avatar.value = file
  if (avatarHandle.value === "remove") {
    avatarHandle.value = null
  }
}

const cropImage = async () => {
  const croppedImage = await cropper.getFile()
  avatar.value = croppedImage
  croppingImage.value = null
}

const setZoom = (val) => {
  const data = cropper.getData()
  cropper.zoomTo(val / 100, {
    x: data.x,
    y: data.y
  })
}

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

const getPreviewImage = (file) => {
  return URL.createObjectURL(file)
}

const submit = async (e) => {
  e.preventDefault()
  loading.value = true
  error.value = null

  const postData = {
    username: username.value,
    about: about.value,
    banner: banner.value
  }

  if (avatar.value) {
    postData.files = {
      avatar: {
        name: avatar.value.name,
        type: avatar.value.type || "image/png",
        size: avatar.value.size,
        file: (await getBase64(avatar.value)).replace(
          "application/octet-stream",
          "image/png"
        )
      }
    }
  }

  if (avatarHandle.value === "remove") {
    postData.avatar = "remove"
    user.avatar = null
  }

  const data = await $fetch("/api/users/me", {
    method: "PATCH",
    headers: generateHeaders(),
    body: JSON.stringify(postData)
  })

  if (data.status === 200) {
    user.about = about.value
    user.banner = banner.value
    if (username.value?.length > 0) {
      user.username = username.value
      user.latestUsernameChange = Date.now()
    }
    if (data.data.avatar) {
      user.avatar = data.data.avatar
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
  <div class="container mx-auto my-20 px-4">
    <h1 class="mb-2 border-b pb-4 text-2xl font-bold dark:border-zinc-900">
      {{ $t("settings.title") }}
    </h1>
    <div class="px-2">
      <p
        class="mb-4 border-b px-2 py-4 font-maven font-semibold dark:border-zinc-900"
      >
        {{ $t("settings.edit_profile") }}
      </p>
      <div
        class="fixed left-0 top-0 z-20 flex h-screen w-full items-center justify-center bg-black/40"
        v-if="loading"
      >
        <Spinner color="#000" />
      </div>
      <div class="my-12 grid gap-8 lg:my-0 lg:grid-cols-2">
        <div
          class="relative rounded border-4 border-gray-100 dark:border-gray-800"
        >
          <div
            class="absolute -left-2 -top-2 z-10 rounded bg-gray-100 px-4 font-maven font-semibold dark:bg-zinc-800"
          >
            {{ $t("settings.preview") }}
          </div>
          <ProfileBanner
            :username="username || user.username"
            :banner="banner"
            :avatar="user.avatar"
            class="absolute !m-0"
          />
          <div class="ml-10 mt-24" v-if="about?.length > 0">
            <h1 class="text-xl font-semibold">{{ $t("settings.about") }}</h1>
            <p
              class="line-clamp-5 max-w-6xl truncate whitespace-pre-wrap break-words text-gray-500 dark:text-gray-100"
            >
              {{ about }}
            </p>
          </div>
        </div>
        <div>
          <Modal
            :show="croppingImage !== null"
            @close="croppingImage = null"
            title="Crop Image"
          >
            <template v-slot:body>
              <div>
                <VuePictureCropper
                  v-if="croppingImage"
                  :boxStyle="{
                    width: '100%',
                    height: '100%',
                    maxHeight: '512px',
                    backgroundColor: '#000'
                  }"
                  :img="getPreviewImage(croppingImage)"
                  :options="{
                    viewMode: 2,
                    dragMode: 'move',
                    aspectRatio: 1
                  }"
                  :preset-mode="{
                    mode: 'fixedSize',
                    width: 512,
                    height: 512
                  }"
                />
                <input
                  type="range"
                  @input="(e) => setZoom(e.target.value)"
                  class="transparent mt-10 h-1.5 w-full cursor-pointer appearance-none rounded-lg border-transparent bg-neutral-200"
                />
              </div>
            </template>
            <template v-slot:footer class>
              <button @click="croppingImage = null">
                {{ $t("settings.cancel") }}
              </button>
              <button
                class="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                @click="cropImage"
              >
                {{ $t("settings.confirm") }}
              </button>
            </template>
          </Modal>
          <form @submit="submit" class="space-y-2">
            <div class="mb-4 space-y-2">
              <div
                class="mb-4 flex items-center gap-4 border-b pb-4 dark:border-zinc-800"
              >
                <div class="space-y-2">
                  <span class="flex items-center gap-2 text-xl font-bold"
                    >{{ $t("settings.avatar") }}
                  </span>
                  <div class="my-2 flex">
                    <div
                      v-if="avatar || (user.avatar && avatarHandle !== 'edit')"
                      class="flex items-center gap-2 border border-gray-200 bg-gray-100 px-4 py-2 dark:border-zinc-900 dark:bg-zinc-950"
                    >
                      <Avatar
                        v-if="user.avatar && avatarHandle !== 'edit'"
                        :username="user.username"
                        :avatar="user.avatar"
                        class="h-16 w-16 rounded-full object-cover"
                      />
                      <img
                        v-else
                        :src="getPreviewImage(avatar)"
                        draggable="false"
                        class="h-16 w-16 rounded-full"
                      />
                      <div class="flex items-center gap-2">
                        <Icon
                          @click="
                            () => {
                              avatar = null
                              user.avatar = null
                              avatarHandle = 'remove'
                            }
                          "
                          name="ic:outline-delete-forever"
                          class="cursor-pointer hover:opacity-75"
                        /><Icon
                          @click="
                            () => {
                              avatar = null
                              avatarHandle = 'edit'
                            }
                          "
                          name="ic:round-edit"
                          class="cursor-pointer hover:opacity-75"
                        />
                      </div>
                    </div>
                    <div v-else class="flex w-full items-center justify-center">
                      <label
                        for="dropzone-file"
                        class="dark:hover:bg-bray-800 flex h-36 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:bg-gray-100 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
                      >
                        <div
                          class="flex select-none flex-col items-center justify-center px-4 pb-6 pt-5"
                        >
                          <Icon
                            name="ic:outline-file-download"
                            class="rotate-180 opacity-50"
                          />
                          <p
                            class="mb-2 text-sm text-gray-500 dark:text-gray-400"
                          >
                            {{ $t("settings.dropzone_text") }}
                          </p>
                          <p class="text-xs text-gray-500 dark:text-gray-400">
                            {{
                              $t("settings.dropzone_types", ["1MB", "512x512"])
                            }}
                          </p>
                        </div>
                        <input
                          @change="uploadFiles"
                          id="dropzone-file"
                          type="file"
                          class="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="mb-4 flex items-center gap-4 border-b pb-4 dark:border-zinc-800"
              >
                <div class="space-y-2">
                  <span class="text-xl font-bold">{{
                    $t("settings.username")
                  }}</span>
                  <div class="flex">
                    <span
                      class="inline-flex items-center border border-gray-300 bg-gray-100 px-3 text-sm text-gray-500 dark:border-zinc-800 dark:bg-zinc-900"
                      :class="{
                        'opacity-50': !isUsernameChangeAvailable
                      }"
                    >
                      @
                    </span>
                    <input
                      :value="username"
                      @input="
                        (e) =>
                          (username = e.target.value.replace(
                            /[^A-Za-z0-9]/g,
                            ''
                          ))
                      "
                      :maxlength="16"
                      :placeholder="user.username"
                      :disabled="!isUsernameChangeAvailable"
                      class="form-input w-full resize-none disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900"
                      type="text"
                    />
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-300">
                    {{ $t("settings.username_notice", [7]) }}
                  </div>
                </div>
              </div>
              <div
                class="mb-4 gap-4 space-y-2 border-b pb-4 dark:border-zinc-800"
              >
                <span class="text-xl font-bold">{{
                  $t("settings.about")
                }}</span>
                <div class="relative">
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
              <div class="space-y-2">
                <span class="text-xl font-bold"
                  >{{ $t("settings.banner_url") }}
                  <span class="text-base text-gray-400 dark:text-gray-300"
                    >({{
                      $t("settings.platform_recommended", ["Imgur"])
                    }})</span
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
                <NuxtLink
                  to="/users/@me"
                  class="rounded bg-gray-50 px-4 py-2 font-bold text-black transition-colors hover:bg-gray-100"
                  >{{ $t("settings.back_to_profile") }}</NuxtLink
                >
                <button
                  class="rounded bg-blue-700 px-4 py-2 font-bold text-white transition-colors hover:bg-blue-600"
                >
                  {{ $t("settings.update_profile") }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="px-2 py-8">
      <p
        class="mb-4 border-b px-2 py-4 font-maven font-semibold dark:border-zinc-900"
      >
        {{ $t("settings.preferences") }}
      </p>
      <label
        class="flex cursor-pointer items-center justify-between border px-4 py-6 dark:border-zinc-900"
        for="debugMode"
      >
        <p>{{ $t("settings.debug_mode") }}</p>
        <HeadlessSwitch
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
        </HeadlessSwitch>
      </label>
    </div>
  </div>
</template>

<style scoped>
label > p {
  @apply cursor-pointer select-none font-maven text-lg font-bold;
}
</style>
