<script setup>
import { useUserStore } from "~/store/user"
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue"
import { onClickOutside, useWindowScroll } from "@vueuse/core"
const localePath = useLocalePath()
const isMenuOpen = ref(false)
const isHeaderHidden = ref(false)
const { $listen } = useNuxtApp()
const route = useRoute()
const scroll = useWindowScroll()
const menuRef = ref(null)
onClickOutside(menuRef, () => {
  isMenuOpen.value = false
})
const userStore = useUserStore()
const entertainment = reactive({
  bright: false,
  loaded: false
})
const isHeaderShown = computed(() => {
  return (
    scroll.y.value > 0 ||
    !(
      route.name.startsWith("details-type-id") || route.name.startsWith("index")
    )
  )
})

const isEntertainmentPage = computed(() => {
  return entertainment.loaded
})

$listen("modal:trailer", (val) => {
  isHeaderHidden.value = val
})

$listen("entertainment:bright", (val) => {
  entertainment.bright = val
})

$listen("entertainment:load", (val) => {
  entertainment.loaded = true
})
</script>

<template>
  <header
    class="fixed top-0 z-30 flex h-16 w-full items-center justify-between bg-gradient-to-t from-transparent to-black px-4 transition-all dark:from-transparent dark:to-zinc-900 md:px-6"
    :class="{
      hidden: isHeaderHidden,
      'bg-gray-50 dark:bg-zinc-900': isHeaderShown
    }"
  >
    <div class="flex w-full items-center justify-between">
      <div class="flex items-center">
        <NuxtLink
          :to="localePath('/')"
          @click="entertainment.bright = false"
          class="select-none font-maven text-2xl font-black transition hover:opacity-75"
          :class="{
            'drop-shadow-md': isEntertainmentPage && !isHeaderShown,
            'text-black':
              entertainment.bright && !isHeaderShown && isEntertainmentPage,
            'text-white':
              (!entertainment.bright &&
                !isHeaderShown &&
                isEntertainmentPage) ||
              ($route.name === 'index' && !isHeaderShown)
          }"
          ><span
            class="text-yellow-500 transition"
            :class="{
              '!text-yellow-500':
                !entertainment.bright && isEntertainmentPage && !isHeaderShown,
              '!text-yellow-300':
                entertainment.bright && isEntertainmentPage && !isHeaderShown
            }"
            >m</span
          ><span class="hidden md:inline-block">asterscore</span></NuxtLink
        >
      </div>
      <Searchbar class="mx-4 lg:mx-0" />
      <div>
        <ClientOnly>
          <div v-if="userStore.isLoading" class="flex gap-2">
            <Spinner />
          </div>
          <Menu
            as="div"
            class="relative z-10 inline-block text-left"
            v-else-if="userStore.isLoggedIn"
            ref="menuRef"
          >
            <div>
              <MenuButton @click="isMenuOpen = !isMenuOpen"
                ><Avatar
                  :username="userStore.user.username"
                  :avatar="userStore.user.avatar"
                  :border="true"
                  class="mt-1.5 h-10 w-10 hover:opacity-90"
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
                  class="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:divide-zinc-900 dark:bg-black"
                >
                  <div class="px-1 py-1">
                    <span class="block px-2 py-1"
                      >@{{ userStore.user.username }}</span
                    >
                  </div>
                  <div class="px-1 py-1">
                    <MenuItem>
                      <NuxtLink
                        class="block rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-zinc-900"
                        :to="localePath('/users/@me')"
                        >Profile</NuxtLink
                      >
                    </MenuItem>
                    <MenuItem>
                      <NuxtLink
                        class="block rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-zinc-900"
                        :to="localePath('/users/@me/watchlist')"
                        >Watchlist</NuxtLink
                      >
                    </MenuItem>
                    <MenuItem>
                      <NuxtLink
                        class="block rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-zinc-900"
                        :to="localePath('/users/@me/reviews')"
                        >Reviews</NuxtLink
                      >
                    </MenuItem>
                    <MenuItem>
                      <NuxtLink
                        class="block rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-zinc-900"
                        :to="localePath('/users/@me/settings')"
                        >Settings</NuxtLink
                      >
                    </MenuItem>
                  </div>
                  <div class="px-1 py-1">
                    <MenuItem>
                      <a
                        @click="userStore.logout"
                        class="block cursor-pointer rounded-lg p-2 text-red-700 hover:bg-red-200 dark:hover:bg-red-200/10"
                      >
                        Logout
                      </a>
                    </MenuItem>
                  </div>
                </MenuItems>
              </div>
            </Transition>
          </Menu>
          <div v-else class="mr-4 flex items-center gap-4">
            <NuxtLink
              :to="localePath('/account/login')"
              class="flex-shrink-0 rounded bg-yellow-500 px-4 py-2 font-semibold text-black transition-colors hover:bg-yellow-600"
              >Sign in</NuxtLink
            >
          </div>
        </ClientOnly>
      </div>
    </div>
  </header>
</template>
