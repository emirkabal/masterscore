<script setup>
import { useUserStore } from "~/store/user"
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue"
import { onClickOutside } from "@vueuse/core"
const isMenuOpen = ref(false)
const menuRef = ref(null)
onClickOutside(menuRef, () => {
  isMenuOpen.value = false
})
const userStore = useUserStore()
</script>

<template>
  <header
    class="flex h-16 items-center justify-between bg-gray-50 px-6 dark:bg-zinc-900 md:px-12"
  >
    <div class="flex items-center">
      <router-link
        to="/"
        class="select-none font-maven text-2xl font-black transition hover:opacity-75"
        ><span class="text-yellow-500">m</span
        ><span class="hidden md:inline-block">asterscore</span></router-link
      >
    </div>
    <Searchbar class="mx-4 md:mx-0" />
    <div v-if="userStore.isLoading">Loading...</div>
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
            class="h-10 w-10 hover:opacity-90"
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
                <router-link
                  class="block rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-zinc-900"
                  to="/users/@me"
                  >Profile</router-link
                >
              </MenuItem>
              <MenuItem>
                <router-link
                  class="block rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-zinc-900"
                  to="/users/@me/watchlist"
                  >Watchlist</router-link
                >
              </MenuItem>
              <MenuItem>
                <router-link
                  class="block rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-zinc-900"
                  to="/users/@me/reviews"
                  >Reviews</router-link
                >
              </MenuItem>
              <MenuItem>
                <router-link
                  class="block rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-zinc-900"
                  to="/users/@me/settings"
                  >Settings</router-link
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
      <router-link to="/account/login" class="hover:opacity-80"
        >Login</router-link
      >
      <router-link
        to="/account/signup"
        class="rounded bg-gray-200 px-4 py-2 font-semibold hover:bg-gray-300 dark:bg-zinc-800 dark:hover:bg-[#1e1e1e]"
        >Signup</router-link
      >
    </div>
  </header>
</template>
