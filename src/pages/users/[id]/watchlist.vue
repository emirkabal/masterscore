<script lang="ts" setup>
import { useUserStore } from "~/store/user"
import { ErrorResponse, IEntertainment, IUser } from "~/@types"
const { params } = useRoute()

definePageMeta({
  middleware: ["auth"]
})

const screenWidth = ref(768)
onMounted(() => {
  screenWidth.value = window.innerWidth
})
const { user: localUser, isLoading } = useUserStore()
const loading = ref(true)
const watchlist = reactive({
  loading: true,
  items: [] as IEntertainment[]
})

const error = ref("")
const user = ref<Omit<IUser, "password"> | undefined>(undefined)

if (params.id.toString().startsWith("@")) {
  params.id = params.id.toString().slice(1)
}

// if (params.id === localUser?.username) {
//   useRouter().push("/users/@me/watchlist")
// }

const fetchWatchlist = async () => {
  watchlist.loading = true
  const userId = user?.value?._id || "-"
  // @ts-ignore -- error after save i dont know why
  const data: IEntertainment[] | ErrorResponse = await $fetch(
    `/api/users/${userId}/watchlist`
  )
  watchlist.loading = false
  if ("status" in data) {
    return
  }
  watchlist.items = data
}

const removeItem = async (id: any) => {
  watchlist.items = watchlist.items.filter((item) => item._id !== id)
  $fetch(`/api/users/me/watchlist`, {
    method: "POST",
    headers: generateHeaders(),
    body: JSON.stringify({
      id,
      type: "remove"
    })
  })
}

if (params.id === "me") {
  loading.value = false
  user.value = localUser
  fetchWatchlist()
  if (user.value) {
    useHead({
      title: `@${user.value.username}'s watchlist`,
      titleTemplate: "%s - Masterscore"
    })
  }
} else {
  onMounted(async () => {
    const data = await $fetch(`/api/users/${params.id}`)
    loading.value = false
    if ("status" in data) {
      error.value = data.message
    } else {
      user.value = data as unknown as Omit<IUser, "password">
      fetchWatchlist()
      useHead({
        title: `@${user.value.username}'s watchlist`,
        titleTemplate: "%s - Masterscore"
      })
    }
  })
}
</script>

<template>
  <div v-if="loading || isLoading" class="mt-48 flex justify-center">
    <Spinner color="#000" />
  </div>
  <div v-else-if="error.length > 0 || !user">
    <h1 class="text-2xl font-bold">Error</h1>
    <p class="text-gray-500">{{ error }}</p>
  </div>
  <div v-else>
    <ProfileBanner
      :banner="user?.banner || ''"
      :username="user.username"
      :is-me="user.username === localUser?.username"
      :viewProfile="true"
    />
    <div class="container mx-auto mt-16 px-4 2xl:mt-10">
      <div
        class="mb-8 flex items-center justify-between border-b p-2 dark:border-zinc-900 md:p-6"
      >
        <h1 class="text-lg font-bold md:text-2xl">
          @{{ user.username }}'s watchlist
        </h1>
      </div>
      <div v-if="watchlist.loading" class="mt-12 flex justify-center">
        <Spinner color="#000" />
      </div>
      <div
        v-else-if="watchlist.items.length === 0"
        class="mt-12 flex justify-center"
      >
        <p class="text-gray-500 dark:text-gray-200">
          There is no entry in the watchlist.
        </p>
      </div>
      <div class="mb-10 flex flex-col gap-2" v-else>
        <div v-for="listItem in watchlist.items" :key="listItem._id">
          <div
            class="flex items-center overflow-hidden rounded bg-white shadow dark:bg-zinc-900"
          >
            <NuxtLink
              :to="`/details/${listItem.type}/${listItem.id}`"
              class="group flex w-full items-center gap-4"
            >
              <img
                :src="`https://image.tmdb.org/t/p/w300_and_h450_bestv2/${listItem.info.poster}`"
                class="h-20 w-auto"
              />
              <p
                :to="`/details/${listItem.type}/${listItem.id}`"
                class="text-base font-semibold group-hover:underline md:text-xl"
              >
                {{ listItem.info.title }}
              </p>
            </NuxtLink>
            <button
              @click="removeItem(listItem._id)"
              class="flex h-20 cursor-pointer items-center bg-red-600 px-6 font-bold text-white transition-colors hover:bg-red-700"
            >
              <IconsTrash class="h-8 w-8" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
