<script lang="ts" setup>
import { useUserStore } from "~/store/user"
import { IActivity, IEntertainment, IReview, IUser } from "~/@types"
const { params } = useRoute()

definePageMeta({
  middleware: ["auth"]
})

const screenWidth = ref(768)
onMounted(() => {
  screenWidth.value = window.innerWidth
})
const { user: localUser } = useUserStore()
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

if (params.id === localUser?.username) {
  useRouter().push("/users/@me/watchlist")
}

const fetchWatchlist = async () => {
  watchlist.loading = true
  const data: IEntertainment[] = await $fetch(
    `/api/users/${user.value?._id}/watchlist`,
    {
      headers: generateHeaders()
    }
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
      id
    })
  })
}

if (params.id === "me") {
  loading.value = false
  user.value = localUser
  fetchWatchlist()
} else {
  onMounted(async () => {
    const data = await $fetch(`/api/users/${params.id}`)
    loading.value = false
    if ("status" in data) {
      error.value = data.message
    } else {
      user.value = data
      fetchWatchlist()
    }
  })
}
</script>

<template>
  <div v-if="loading" class="flex justify-center mt-48">
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
    <div class="container px-4 mx-auto 2xl:mt-10 mt-16">
      <div
        class="flex items-center justify-between border-b dark:border-zinc-900 p-2 md:p-6 mb-8"
      >
        <h1 class="font-bold text-lg md:text-2xl">
          @{{ user.username }}'s watchlist
        </h1>
      </div>
      <div v-if="watchlist.loading" class="flex justify-center mt-12">
        <Spinner color="#000" />
      </div>
      <div
        v-else-if="watchlist.items.length === 0"
        class="flex justify-center mt-12"
      >
        <p class="text-gray-500 dark:text-gray-200">
          There is no entry in the watchlist.
        </p>
      </div>
      <div class="flex flex-col gap-2 mb-10" v-else>
        <div v-for="listItem in watchlist.items" :key="listItem._id">
          <div
            class="bg-white dark:bg-zinc-900 rounded shadow flex items-center justify-between overflow-hidden"
          >
            <div class="flex gap-8 items-center">
              <img
                :src="`https://image.tmdb.org/t/p/w300_and_h450_bestv2/${listItem.info.poster}`"
                class="h-36 w-auto"
              />
              <router-link
                :to="`/details/${listItem.type}/${listItem.id}`"
                class="font-semibold hover:underline text-2xl"
              >
                {{ listItem.info.title }}
              </router-link>
            </div>
            <button
              @click="removeItem(listItem._id)"
              class="bg-red-600 text-white font-bold px-8 transition-colors hover:bg-red-700 h-36 flex items-center cursor-pointer"
            >
              <IconsTrash class="w-8 h-8" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
