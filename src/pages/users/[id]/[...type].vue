<script setup lang="ts">
import {
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Menu,
  MenuButton,
  MenuItems,
  MenuItem
} from "@headlessui/vue"
import { onClickOutside, useClipboard } from "@vueuse/core"
import { useUserStore } from "~/store/user"
import { IEntertainment, IReview, IUser } from "~/@types"

const url = window.location.origin
const { copy } = useClipboard()
const { $moment } = useNuxtApp()
const { params } = useRoute()
const user = ref<Omit<IUser, "email" | "password">>()
const loading = ref(true)
const selectedTab = ref(0)
const isMenuOpen = ref(false)
const menuRef = ref(null)
onClickOutside(menuRef, () => {
  isMenuOpen.value = false
})

const error = ref(false)

const self = computed(() => useUserStore().user)

const isSelf = computed(() => {
  return user.value?._id === self.value?._id
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
  // @ts-ignore
  const data: IEntertainment[] = await $fetch(
    `/api/users/${user.value?._id}/watchlist`
  )
  watchlist.pending = false
  if ("status" in data) {
    return
  }

  watchlist.items = data
}

const adminRequest = async (body: any) => {
  await $fetch(`/api/admin/users/${user.value?._id}`, {
    method: "PATCH",
    headers: generateHeaders(),
    body: JSON.stringify(body)
  })
}

const verifyUser = async (bool: boolean) => {
  await adminRequest({ verified: bool })
  if (user.value) {
    user.value.verified = bool
  }
}

const giveWatchAccess = async (bool: boolean) => {
  await adminRequest({ features: bool ? ["WATCH"] : [] })
  if (user.value) {
    user.value.features = bool ? ["WATCH"] : []
  }
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

onMounted(async () => {
  if (params.id === "me") {
    user.value = useUserStore().user
  } else {
    // @ts-ignore
    user.value = await $fetch(`/api/users/${params.id}`)
    if (!user.value || "status" in user.value) {
      error.value = true
      return
    }
  }
  await fetchSummary()
  loading.value = false

  if (params.type[0] === "reviews") {
    changeTab(1)
  } else if (params.type[0] === "watchlist") {
    changeTab(2)
  } else {
    changeTab(0)
  }

  useHead({
    title: `@${user.value?.username}`,
    titleTemplate: "%s - Masterscore"
  })
})

definePageMeta({
  middleware: ["auth"]
})

useHead({
  title: `...`,
  titleTemplate: "%s - Masterscore"
})
</script>
<template>
  <div v-if="error" class="mt-28">
    <p class="text-center font-maven text-6xl font-black uppercase">
      User not found
    </p>
  </div>
  <div
    class="mx-auto flex h-screen items-center justify-center"
    v-else-if="loading"
  >
    <Loader />
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
        <div class="md:ml-auto md:mt-20">
          <Menu
            as="div"
            class="relative z-10 inline-block text-left"
            ref="menuRef"
          >
            <div>
              <MenuButton
                class="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-zinc-900"
                @click="isMenuOpen = !isMenuOpen"
                ><IconsDots class="h-6 w-6 rotate-90 md:rotate-0"
              /></MenuButton>
            </div>
            <Transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div v-show="isMenuOpen" @click="isMenuOpen = !isMenuOpen">
                <MenuItems
                  :static="true"
                  class="absolute right-0 z-10 mt-2 w-56 origin-top-right translate-x-1/2 divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:divide-zinc-900 dark:bg-zinc-950 md:translate-x-0"
                >
                  <div class="px-1 py-1">
                    <div v-if="self?._id === '63f4dcf150582a1ca831f639'">
                      <MenuItem>
                        <a
                          class="block rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-zinc-900"
                          @click="verifyUser(!user.verified)"
                          href="#"
                        >
                          {{ user.verified ? "Revoke" : "Give" }} verified
                        </a>
                      </MenuItem>
                      <MenuItem>
                        <a
                          class="block rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-zinc-900"
                          @click="
                            giveWatchAccess(!user.features.includes('WATCH'))
                          "
                          href="#"
                          >{{
                            user.features.includes("WATCH") ? "Revoke" : "Give"
                          }}
                          access to watch</a
                        >
                      </MenuItem>
                    </div>
                    <MenuItem>
                      <a
                        class="block rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-zinc-900"
                        href="#"
                        @click="copy(`${url}/users/@${user?.username}`)"
                        >Copy URL</a
                      >
                    </MenuItem>
                  </div>
                  <div v-if="isSelf" class="px-1 py-1">
                    <MenuItem>
                      <NuxtLink
                        class="block rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-zinc-900"
                        to="/users/@me/settings"
                        >Edit Profile</NuxtLink
                      >
                    </MenuItem>
                  </div>
                </MenuItems>
              </div>
            </Transition>
          </Menu>
        </div>
      </div>

      <TabGroup :selectedIndex="selectedTab" @change="changeTab">
        <div class="flex overflow-x-auto scrollbar-none">
          <TabList>
            <Tab>Summary</Tab>
            <Tab v-if="user.reviews?.length"
              >Reviews ({{
                reviews.items.length || user.reviews?.length || 0
              }})</Tab
            >
            <Tab v-if="user.watchlist?.length"
              >Watchlist ({{
                watchlist.items.length || user.watchlist?.length || 0
              }})</Tab
            >
          </TabList>
        </div>
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
          </TabPanel>
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
  @apply block min-w-[120px] flex-shrink-0 select-none rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-700 focus:outline-none dark:bg-zinc-900 dark:text-gray-300;
}
button[role="tab"][aria-selected="true"] {
  @apply bg-yellow-500 font-semibold text-black transition-all focus:outline-none;
}
</style>
