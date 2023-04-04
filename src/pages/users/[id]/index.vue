<script lang="ts" setup>
import { useUserStore } from "~/store/user"
import { IActivity, IUser } from "~/@types"
import debounce from "lodash.debounce"
import { vIntersectionObserver } from "@vueuse/components"
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
  loadingMore: false,
  finished: false,
  page: 1,
  items: [] as IActivity[]
})
const error = ref("")
const user = ref<Omit<IUser, "password"> | undefined>(undefined)

params.id = params.id.toString()
if (params.id.startsWith("@")) {
  params.id = params.id.slice(1)
}

// if (params.id === localUser?.username) {
//   useRouter().push("/users/@me")
// }

const fetchActivities = async () => {
  const userId = user.value?._id
  if (userId) {
    if (activities.items.length === 0) activities.loading = true
    else activities.loadingMore = true
    const data = await $fetch(
      `/api/activities?author=${userId}&limit=10&page=${activities.page}`
    )
    if (data)
      activities.items = [
        ...activities.items,
        ...data
      ] as unknown as IActivity[]
    if (data.length < 10) activities.finished = true
    activities.loading = false
    activities.loadingMore = false
    activities.page++
  }
}

const isVisible = ref(false)

function onIntersectionObserver([{ isIntersecting }]: any) {
  isVisible.value = isIntersecting
}

watch(
  isVisible,
  debounce(async (value) => {
    if (
      value &&
      !activities.loading &&
      !activities.loadingMore &&
      !activities.finished
    ) {
      await fetchActivities()
    }
  }, 350)
)
watch(loading, async () => {
  await fetchActivities()
})

if (params.id === "me") {
  loading.value = false
  user.value = localUser
  useHead({
    title: user.value?.username,
    titleTemplate: "@%s - Masterscore"
  })
} else {
  onMounted(async () => {
    const data = await $fetch(`/api/users/${params.id}`)
    loading.value = false
    if ("status" in data) {
      error.value = data.message
    } else {
      user.value = data as unknown as Omit<IUser, "password">
    }
    useHead({
      title: user.value?.username,
      titleTemplate: "@%s - Masterscore"
    })
  })
}

const getActivityTitle = (type: string) => {
  const types = {
    like: "Recommended:",
    review: "Reviewed:",
    watchlist: "Added to watchlist:"
  } as Record<string, string>
  return types[type] || "Unknown"
}
</script>

<template>
  <div v-if="loading" class="mt-48 flex justify-center">
    <Spinner color="#000" />
  </div>
  <div v-else-if="error.length > 0 || !user">
    <h1 class="text-2xl font-bold">Error</h1>
    <p class="text-gray-500">{{ error }}</p>
  </div>
  <div v-else>
    <ProfileBanner
      :banner="user.banner"
      :username="user.username"
      :avatar="user.avatar"
      :is-me="user.username === localUser?.username"
    />
    <div class="container mx-auto mb-24 mt-16 px-4 2xl:mt-10">
      <div
        class="mb-8 flex items-center justify-between border-b p-2 dark:border-zinc-900 md:p-6"
      >
        <h1 class="text-xl font-bold md:text-4xl">@{{ user.username }}</h1>
        <p class="flex gap-1 text-sm text-gray-500 dark:text-gray-300">
          <span class="font-bold">Joined:</span>
          <span class="hidden md:block">{{
            $moment(user.createdAt).format("MMMM Do YYYY")
          }}</span>
          <span class="flex"
            ><span class="hidden md:block">(</span
            >{{ $moment(user.createdAt).fromNow()
            }}<span class="hidden md:block">)</span></span
          >
        </p>
      </div>
      <div class="flex justify-between gap-8">
        <div class="flex w-full max-w-6xl flex-grow-0 flex-col gap-8">
          <div>
            <h2
              class="mb-2 border-b pb-2 text-xl font-bold dark:border-zinc-900 md:text-2xl"
            >
              About
            </h2>
            <p
              class="line-clamp-5 truncate whitespace-pre-wrap break-words text-gray-500 dark:text-gray-100"
            >
              {{ user.about ? user.about : "No about information" }}
            </p>
          </div>
          <div>
            <div
              class="mb-4 flex items-center justify-between border-b pb-2 dark:border-zinc-900"
            >
              <h2 class="text-xl font-bold md:text-2xl">Latest Activity</h2>
              <div class="flex items-center gap-2">
                <NuxtLink
                  :to="`/users/@${
                    user._id === localUser?._id ? 'me' : user.username
                  }/watchlist`"
                  class="rounded bg-white px-4 py-2 text-sm font-semibold shadow transition-colors hover:bg-gray-50 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                >
                  Watchlist
                </NuxtLink>
                <NuxtLink
                  :to="`/users/@${
                    user._id === localUser?._id ? 'me' : user.username
                  }/reviews`"
                  class="rounded bg-white px-4 py-2 text-sm font-semibold shadow transition-colors hover:bg-gray-50 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                >
                  Reviews
                </NuxtLink>
              </div>
            </div>

            <div v-if="activities.loading" class="flex justify-center">
              <Spinner color="#000" />
            </div>
            <div v-else-if="activities.items.length === 0">
              <p class="text-gray-500 dark:text-gray-300">No activity</p>
            </div>
            <div v-else>
              <div
                v-for="(activity, i) in activities.items"
                v-intersection-observer="
                  i === activities.items.length - 1
                    ? onIntersectionObserver
                    : () => {}
                "
                :key="activity._id"
              >
                <NuxtLink
                  class="group mb-4 flex items-center gap-2 rounded-3xl bg-gray-50 p-2 transition-colors hover:bg-gray-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                  :to="`/details/${activity.entertainment.type}/${activity.entertainment.id}`"
                >
                  <div class="relative">
                    <IconsThumbUpFilled
                      v-if="activity?.type === 'like'"
                      class="text-cyan-500"
                    />
                    <IconsListAdd
                      v-else-if="activity?.type === 'watchlist'"
                      class="text-black-600"
                    />
                    <IconsStarFilled v-else class="text-yellow-400" />
                    <span
                      v-if="activity?.type === 'review' && activity.attribute"
                      class="absolute left-0 right-0 top-0 mt-1.5 text-center text-[8px] font-bold text-black"
                    >
                      {{ activity.attribute }}
                    </span>
                  </div>
                  <div class="line-clamp-1 break-words">
                    {{ getActivityTitle(activity.type) }}
                    <span class="font-semibold group-hover:underline">{{
                      activity.entertainment.info.title
                    }}</span>
                  </div>
                  <p
                    class="ml-auto flex-shrink-0 pr-2 text-xs text-gray-500 dark:text-gray-300"
                  >
                    {{ $moment(activity.createdAt).fromNow() }}
                  </p>
                </NuxtLink>
              </div>
              <div
                v-if="activities.loadingMore"
                class="my-2 flex justify-center"
              >
                <Spinner color="#000" />
              </div>
            </div>
          </div>
        </div>
        <div
          class="top-20 hidden h-fit w-full max-w-sm flex-grow space-y-4 self-start rounded-3xl bg-gray-50 p-8 text-gray-500 dark:bg-zinc-900 dark:text-gray-300 md:block lg:sticky"
        >
          <p>
            <span class="font-bold">Recommends:</span>
            {{ user.likes?.length }}
          </p>
          <p>
            <span class="font-bold">Reviews:</span>
            {{ user.reviews?.length }}
          </p>
          <p>
            <span class="font-bold">Watched:</span>
            {{ user.watcheds?.length }}
          </p>
          <p>
            <span class="font-bold">Watchlist:</span>
            {{ user.watchlist?.length }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
