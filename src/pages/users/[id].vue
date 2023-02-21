<script lang="ts" setup>
import { useUserStore } from "~/store/user"
import Avatar from "~/components/Avatar.vue"
import { IActivity, IUser } from "~/@types"
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
const activities = reactive({
  loading: true,
  items: [] as IActivity[]
})
const error = ref("")
const user = ref<Omit<IUser, "password"> | undefined>(undefined)

if (params.id.toString().startsWith("@")) {
  params.id = params.id.toString().slice(1)
}

if (params.id === localUser?.username) {
  useRouter().push("/users/@me")
}

watch(loading, async () => {
  const userId = user.value?._id
  console.log(userId)
  if (userId) {
    const data = await $fetch(`/api/activities?author=${userId}`)
    activities.items = data
    activities.loading = false
  }
})

if (params.id === "me") {
  loading.value = false
  user.value = localUser
} else {
  onMounted(async () => {
    const data = await $fetch(`/api/users/${params.id}`)
    loading.value = false
    if ("status" in data) {
      error.value = data.message
    } else {
      user.value = data
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
    <div
      :style="`background-image: url(${user.banner})`"
      class="w-full h-64 bg-gray-500 relative bg-cover bg-center"
    >
      <router-link
        v-if="user.username === localUser?.username"
        to="/users/@me/edit"
        class="px-4 py-2 rounded hover:bg-gray-50 bg-white text-black font-bold absolute bottom-0 right-0 m-4 transition-colors"
        >Edit Profile</router-link
      >
      <div class="absolute md:-bottom-16 md:left-10 -bottom-12 left-8">
        <Avatar class="md:w-32 md:h-32 w-24 h-24" :username="user.username" />
      </div>
    </div>
    <div class="container px-4 m-auto 2xl:mt-10 mt-16">
      <div class="flex items-center justify-between border-b p-2 md:p-6 mb-8">
        <h1 class="font-bold text-xl md:text-4xl">@{{ user.username }}</h1>
        <p class="text-gray-500 text-sm flex gap-1">
          <span class="font-bold">Joined:</span>
          <span class="hidden md:block">{{
            $moment(user.createdAt).format("MMMM Do YYYY")
          }}</span>
          <span class="flex"
            ><span class="md:block hidden">(</span
            >{{ $moment(user.createdAt).fromNow()
            }}<span class="md:block hidden">)</span></span
          >
        </p>
      </div>
      <div class="flex justify-between gap-8">
        <div class="flex flex-col gap-8 w-full max-w-6xl flex-grow-0">
          <div>
            <h2 class="font-bold text-xl md:text-2xl pb-2 border-b mb-2">
              About
            </h2>
            <p
              class="text-gray-500 break-words whitespace-pre-wrap truncate line-clamp-5"
            >
              {{ user.about ? user.about : "No about information" }}
            </p>
          </div>
          <div>
            <h2 class="font-bold text-xl md:text-2xl mb-4 border-b pb-2">
              Latest Activity
            </h2>

            <div v-if="activities.loading" class="flex justify-center">
              <Spinner color="#000" />
            </div>
            <div v-else-if="activities.items.length === 0">
              <p class="text-gray-500">No activity</p>
            </div>
            <div v-else>
              <div v-for="activity in activities.items" :key="activity._id">
                <router-link
                  class="flex items-center gap-2 mb-4 bg-gray-50 p-2 hover:bg-gray-100 group rounded-3xl transition-colors"
                  :to="`/details/${activity.entertainment.type}/${activity.entertainment.id}`"
                >
                  <div class="relative">
                    <IconsHeartFilled
                      v-if="activity.type === 'like'"
                      class="text-red-600"
                    />
                    <IconsStarFilled v-else class="text-yellow-400" />
                    <span
                      v-if="activity.type === 'review' && activity.attribute"
                      class="absolute top-0 mt-1.5 right-0 left-0 text-[8px] font-bold text-black text-center"
                    >
                      {{ activity.attribute }}
                    </span>
                  </div>
                  <div class="break-words line-clamp-1">
                    {{ activity.type === "like" ? "Liked:" : "Reviewed:" }}
                    <span class="group-hover:underline font-semibold">{{
                      activity.entertainment.info.title
                    }}</span>
                  </div>
                  <p class="text-xs text-gray-500 ml-auto pr-2 flex-shrink-0">
                    {{ $moment(activity.createdAt).fromNow() }}
                  </p>
                </router-link>
              </div>
            </div>
          </div>
        </div>
        <div
          class="bg-gray-50 md:block hidden rounded-3xl p-8 space-y-4 h-fit max-w-sm w-full flex-grow"
        >
          <p class="text-gray-500">
            <span class="font-bold">Likes:</span>
            {{ user.likes?.length }}
          </p>
          <p class="text-gray-500">
            <span class="font-bold">Reviews:</span>
            {{ user.reviews?.length }}
          </p>
          <p class="text-gray-500">
            <span class="font-bold">Watched:</span>
            {{ user.watcheds?.length }}
          </p>
          <p class="text-gray-500">
            <span class="font-bold">Watchlist:</span>
            {{ user.watchlist?.length }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
