<script setup>
import { useUserStore } from "~/store/user"
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue"
import { onClickOutside, useWindowScroll } from "@vueuse/core"
const { $listen } = useNuxtApp()
const scroll = useWindowScroll()
const isMenuOpen = ref(false)
const menuRef = ref(null)
const isHeaderHidden = ref(false)
onClickOutside(menuRef, () => {
  isMenuOpen.value = false
})
const userStore = useUserStore()
$listen("modal:trailer", (val) => {
  isHeaderHidden.value = val
})
</script>

<template>
  <header
    class="fixed top-0 z-30 flex h-16 w-full items-center justify-between px-6 transition-all md:px-12"
    :class="{
      hidden: isHeaderHidden,
      'bg-gray-50 dark:bg-black/20':
        scroll.y.value === 0 && $route.path !== '/',
      'bg-gray-100 dark:bg-black/60': scroll.y.value > 0,
      'dark:bg-zinc-900':
        scroll.y.value === 0 &&
        ($route.path === '/' || $route.path.indexOf('/person/') > -1)
    }"
  >
    <div class="flex items-center">
      <NuxtLink
        to="/"
        class="select-none font-maven text-2xl font-black transition hover:opacity-75"
        ><span class="text-yellow-500">m</span
        ><span class="hidden md:inline-block">asterscore</span></NuxtLink
      >
    </div>
    <Searchbar class="mx-4 lg:mx-0" />
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
                  to="/users/@me"
                  >Profile</NuxtLink
                >
              </MenuItem>
              <MenuItem>
                <NuxtLink
                  class="block rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-zinc-900"
                  to="/users/@me/watchlist"
                  >Watchlist</NuxtLink
                >
              </MenuItem>
              <MenuItem>
                <NuxtLink
                  class="block rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-zinc-900"
                  to="/users/@me/reviews"
                  >Reviews</NuxtLink
                >
              </MenuItem>
              <MenuItem>
                <NuxtLink
                  class="block rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-zinc-900"
                  to="/users/@me/settings"
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
    <div v-else class="flex items-center gap-4">
      <NuxtLink to="/account/login" class="hover:opacity-80">Login</NuxtLink>
      <NuxtLink
        to="/account/signup"
        class="rounded bg-gray-200 px-4 py-2 font-semibold hover:bg-gray-300 dark:bg-zinc-800 dark:hover:bg-[#1e1e1e]"
        >Signup</NuxtLink
      >
    </div>
  </header>
</template>
