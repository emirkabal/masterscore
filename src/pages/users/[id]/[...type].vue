<script setup lang="ts">
import { onClickOutside, useClipboard } from "@vueuse/core"
import { useUserStore } from "~/store/user"
import type { IEntertainment, IReview, User } from "~/types"

const url = window.location.origin
const { copy } = useClipboard()
const { $moment } = useNuxtApp()
const { params } = useRoute()
const user = ref<Omit<User, "email" | "password">>()
const loading = ref(true)
const selectedTab = ref(0)
const isMenuOpen = ref(false)
const menuRef = ref(null)
onClickOutside(menuRef, () => {
  isMenuOpen.value = false
})

const error = ref(false)
const id = computed(() => params.id.toString().replace("@", ""))

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

const fetchSummary = async () => {
  const data = await $fetch(`/api/users/${user.value?.id}/summary`)
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
  const data = await $fetch(`/api/users/${user.value?._id}/reviews`, {})
  if ("status" in data) {
    return
  }
  reviews.items = data as unknown as IReview[]
  reviews.pending = false
}

const fetchWatchlist = async () => {
  watchlist.pending = true
  // @ts-ignore
  const data = await $fetch<IEntertainment[]>(`/api/users/${user.value?._id}/watchlist`)
  watchlist.pending = false
  if ("status" in data) {
    return
  }

  watchlist.items = data
}

const adminRequest = async (body: any) => {
  await $fetch(`/api/admin/users/${user.value?._id}`, {
    method: "PATCH",
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
  `/users/@${id.value}`,
  `/users/@${id.value}/reviews`,
  `/users/@${id.value}/watchlist`
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
  if (id.value === "me") {
    user.value = useUserStore().user
  } else {
    // @ts-ignore
    user.value = await $fetch(`/api/users/${id.value}`)
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
  <div v-if="error" class="my-28">
    <p class="text-center font-maven text-6xl font-black uppercase">User not found</p>
  </div>
  <div class="mx-auto flex h-screen items-center justify-center" v-else-if="loading">
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
        <div
          v-else
          class="aspect-video max-h-[150px] w-full rounded-3xl bg-gradient-to-tl from-yellow-400 from-10% to-yellow-600"
        ></div>
      </div>

      <div class="user -mt-20 flex select-none flex-col items-center md:flex-row md:pl-5">
        <div class="avatar relative">
          <Avatar
            :avatar="user?.avatar"
            :username="user.username"
            class="h-[120px] w-[120px] rounded-full border-8 border-white align-top md:h-[160px] md:w-[160px] dark:border-gray-950"
          />
        </div>
        <div class="details inline-block text-center md:ml-7 md:text-left">
          <div class="username mb-1 flex items-center gap-2 text-3xl font-semibold md:mt-24">
            <span> {{ user.username }} </span>
            <Verified v-if="user.verified" />
          </div>
          <div
            class="opacity-75"
            v-tooltip="{
              content: $moment(user.createdAt).locale($i18n.locale).format('LLL'),
              delay: 20
            }"
          >
            {{
              $t("profile.created", {
                n: $moment(user.createdAt).locale($i18n.locale).fromNow()
              })
            }}
          </div>
        </div>
        <div class="md:ml-auto md:mt-20">
          <HeadlessMenu as="div" class="relative z-10 inline-block text-left" ref="menuRef">
            <div>
              <HeadlessMenuButton
                class="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-900"
                @click="isMenuOpen = !isMenuOpen"
                ><Icon name="mdi:dots-vertical" class="h-6 w-6 rotate-90 md:rotate-0"
              /></HeadlessMenuButton>
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
                <HeadlessMenuItems
                  :static="true"
                  class="absolute right-0 z-10 mt-2 w-56 origin-top-right translate-x-1/2 divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none md:translate-x-0 dark:divide-gray-900 dark:bg-gray-900"
                >
                  <div class="px-1 py-1">
                    <div v-if="self?._id === '63f4dcf150582a1ca831f639'">
                      <HeadlessMenuItem>
                        <button
                          class="inline-flex w-full rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                          @click="verifyUser(!user.verified)"
                        >
                          {{ user.verified ? "Revoke" : "Give" }} verified
                        </button>
                      </HeadlessMenuItem>
                      <HeadlessMenuItem>
                        <button
                          class="inline-flex w-full rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                          @click="giveWatchAccess(!user.features.includes('WATCH'))"
                        >
                          {{ user.features.includes("WATCH") ? "Revoke" : "Give" }}
                          access to watch
                        </button>
                      </HeadlessMenuItem>
                    </div>
                    <HeadlessMenuItem>
                      <button
                        class="inline-flex w-full rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                        @click="copy(`${url}/users/@${user?.username}`)"
                      >
                        {{ $t("profile.copy_url") }}
                      </button>
                    </HeadlessMenuItem>
                  </div>
                  <div v-if="isSelf" class="px-1 py-1">
                    <HeadlessMenuItem>
                      <NuxtLink
                        class="block rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                        to="/users/@me/settings"
                        >{{ $t("profile.edit_profile") }}</NuxtLink
                      >
                    </HeadlessMenuItem>
                  </div>
                </HeadlessMenuItems>
              </div>
            </Transition>
          </HeadlessMenu>
        </div>
      </div>

      <HeadlessTabGroup :selectedIndex="selectedTab" @change="changeTab">
        <HeadlessTabList>
          <HeadlessTab>{{ $t("profile.summary") }}</HeadlessTab>
          <HeadlessTab v-if="user.reviews?.length">{{
            $t("profile.reviews", {
              n: reviews.items.length || user.reviews?.length || 0
            })
          }}</HeadlessTab>
          <HeadlessTab v-if="user.watchlist?.length">{{
            $t("profile.watchlist", {
              n: watchlist.items.length || user.watchlist?.length || 0
            })
          }}</HeadlessTab>
        </HeadlessTabList>
        <HeadlessTabPanels>
          <HeadlessTabPanel
            ><section>
              <div v-if="user.about" class="mt-8 rounded border-l-4 border-l-yellow-500 p-2 pl-6">
                <p
                  class="line-clamp-5 truncate whitespace-pre-wrap break-words text-gray-500 dark:text-gray-100"
                >
                  {{ user.about }}
                </p>
              </div>

              <ProfileSummary :summary="summary" />
            </section>
          </HeadlessTabPanel>
          <HeadlessTabPanel>
            <ProfileReviews :reviews="reviews" />
          </HeadlessTabPanel>
          <HeadlessTabPanel>
            <ProfileWatchlist
              :watchlist="watchlist"
              :self="isSelf"
              @remove="(id) => (watchlist.items = watchlist.items.filter((i) => i._id !== id))"
            />
          </HeadlessTabPanel>
        </HeadlessTabPanels>
      </HeadlessTabGroup>
    </div>
  </div>
</template>

<style scoped>
div[role="tablist"] {
  @apply mx-auto mt-6 flex items-center  justify-start gap-2 overflow-x-auto scrollbar-none md:mx-0;
}
button[role="tab"] {
  @apply block flex-shrink-0 select-none rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-700 focus:outline-none dark:bg-gray-900 dark:text-gray-300;
}
button[role="tab"][aria-selected="true"] {
  @apply bg-yellow-500 text-black transition-all focus:outline-none;
}
</style>
