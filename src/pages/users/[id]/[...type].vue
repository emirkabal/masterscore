<script setup lang="ts">
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue"
import { useUserStore } from "~/store/user"
import { IEntertainment, IReview, IUser } from "~/@types"

const { $moment } = useNuxtApp()
const { params } = useRoute()
const user = ref<Omit<IUser, "email" | "password">>()
const loading = ref(true)
const selectedTab = ref(0)

const isSelf = computed(() => {
  return user.value?._id === useUserStore().user?._id
})

const summary = reactive({
  pending: true,
  featured: [] as IReview[],
  reviews: [] as IEntertainment[],
  recommendations: [] as IEntertainment[],
  watchlist: [] as IEntertainment[]
})

const reviews = reactive({
  pending: true,
  items: [] as IReview[]
})

const watchlist = reactive({
  pending: true,
  items: [] as IEntertainment[]
})

params.id = params.id.toString()
if (params.id.startsWith("@")) {
  params.id = params.id.slice(1)
}

if (params.id === "me") {
  user.value = useUserStore().user
} else {
  // @ts-ignore
  user.value = await $fetch(`/api/users/${params.id}`)
}

const fetchSummary = async () => {
  const data = await $fetch(`/api/users/${user.value?._id}/summary`, {
    headers: generateHeaders()
  })
  if ("status" in data) {
    return
  }
  summary.featured = data.featured as unknown as IReview[]
  summary.reviews = data.reviews
  summary.recommendations = data.likes
  summary.watchlist = data.watchlist
  summary.pending = false
}

const fetchReviews = async () => {
  reviews.pending = true
  const data = await $fetch(`/api/users/${user.value?._id}/reviews`, {
    headers: generateHeaders()
  })
  if ("status" in data) {
    return
  }
  reviews.items = data as unknown as IReview[]
  reviews.pending = false
}

const fetchWatchlist = async () => {
  watchlist.pending = true
  const data: IEntertainment[] = await $fetch(
    `/api/users/${user.value?._id}/watchlist`
  )
  watchlist.pending = false
  if ("status" in data) {
    return
  }

  watchlist.items = data
}

const routes = [
  `/users/@${params.id}`,
  `/users/@${params.id}/reviews`,
  `/users/@${params.id}/watchlist`
]

const changeTab = (index: number) => {
  selectedTab.value = index
  if (index === 1) {
    fetchReviews()
  } else if (index === 2) {
    fetchWatchlist()
  }
  window.history.replaceState(history.state, "", routes[index])
}

if (params.type[0] === "reviews") {
  changeTab(1)
} else if (params.type[0] === "watchlist") {
  changeTab(2)
} else {
  changeTab(0)
}

onMounted(async () => {
  if (params.id === "me") {
    user.value = useUserStore().user
  } else {
    // @ts-ignore
    user.value = await $fetch(`/api/users/${params.id}`)
  }
  loading.value = false
  await fetchSummary()
})

definePageMeta({
  middleware: ["auth"],
  scrollToTop: false
})

useHead({
  title: `@${user.value?.username}`,
  titleTemplate: "%s - Masterscore"
})
</script>
<template>
  <div class="mx-auto flex h-screen items-center justify-center" v-if="loading">
    <Spinner />
  </div>
  <div class="my-20" v-else>
    <div class="container mx-auto max-w-6xl px-4" v-if="user">
      <div class="banner">
        <MasterImage
          v-if="user?.banner"
          :source="user?.banner"
          class="h-[calc(100vw*0.3)] max-h-[390px] min-h-[120px] select-none rounded-3xl"
        />
        <div v-else class="h-[390px] w-full rounded-3xl bg-gray-800"></div>
      </div>

      <div
        class="user -mt-20 flex select-none flex-col items-center md:flex-row md:pl-5"
      >
        <div class="avatar relative">
          <Avatar
            :avatar="user?.avatar"
            :username="user.username"
            class="h-[120px] w-[120px] rounded-full border-8 border-white align-top dark:border-black md:h-[160px] md:w-[160px]"
          />
        </div>
        <div class="details inline-block text-center md:ml-7 md:text-left">
          <div
            class="username mb-1 flex items-center gap-2 text-3xl font-semibold md:mt-24"
          >
            <span> @{{ user.username }} </span>
            <Verified class="mt-1" v-if="user.verified" />
          </div>
          <div
            class="created opacity-75"
            v-tooltip="{
              content: $moment(user.createdAt).format(
                'MMMM Do YYYY, h:mm:ss a'
              ),
              delay: 20
            }"
          >
            created {{ $moment(user.createdAt).fromNow() }}
          </div>
        </div>
      </div>

      <TabGroup :selectedIndex="selectedTab" @change="changeTab">
        <OverflowBehavior>
          <TabList>
            <Tab>Summary</Tab>
            <Tab
              >Reviews ({{
                reviews.items.length || user.reviews?.length || 0
              }})</Tab
            >
            <Tab
              >Watchlist ({{
                watchlist.items.length || user.watchlist?.length || 0
              }})</Tab
            >
          </TabList>
        </OverflowBehavior>
        <TabPanels>
          <TabPanel
            ><section>
              <div
                v-if="user.about"
                class="mt-8 rounded border-l-4 border-l-yellow-500 p-2 pl-6"
              >
                <p
                  class="line-clamp-5 truncate whitespace-pre-wrap break-words text-gray-500 dark:text-gray-100"
                >
                  {{ user.about }}
                </p>
              </div>

              <ProfileSummary :summary="summary" />
            </section>
          </TabPanel>
          <TabPanel>
            <ProfileReviews :reviews="reviews" />
            ></TabPanel
          >
          <TabPanel>
            <ProfileWatchlist
              :watchlist="watchlist"
              :self="isSelf"
              @remove="
                (id) =>
                  (watchlist.items = watchlist.items.filter(
                    (i) => i._id !== id
                  ))
              "
            />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  </div>
</template>

<style>
div[role="tablist"] {
  @apply mx-auto mt-6 flex items-center justify-center gap-2 md:mx-0;
}
button[role="tab"] {
  @apply block min-w-[120px] select-none rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-700 focus:outline-none dark:bg-zinc-900 dark:text-gray-300;
}
button[role="tab"][aria-selected="true"] {
  @apply bg-yellow-500 font-semibold text-black transition-all focus:outline-none;
}
</style>
