<script setup>
import { useUserStore } from "~/store/user"
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue"

const userStore = useUserStore()
</script>

<template>
  <header class="flex h-16 px-12 items-center justify-between bg-gray-50">
    <div class="flex items-center">
      <router-link to="/" class="font-black text-xl mr-8 font-maven select-none"
        >masterscore</router-link
      >
    </div>
    <Searchbar />
    <div v-if="userStore.isLoading">Loading...</div>
    <Menu
      as="div"
      class="relative inline-block text-left"
      v-else-if="userStore.isLoggedIn"
    >
      <div>
        <MenuButton
          class="inline-flex w-full justify-center rounded-md bg-black bg-opacity-50 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 select-none"
          >@{{ userStore.user.username }}</MenuButton
        >
      </div>
      <Transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <MenuItems
          class="absolute z-10 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div class="px-1 py-1">
            <MenuItem>
              <router-link
                class="hover:bg-gray-50 p-2 rounded-lg block"
                to="/users/@me"
                >Profile</router-link
              >
            </MenuItem>
            <MenuItem>
              <router-link
                class="hover:bg-gray-50 p-2 rounded-lg block"
                to="/users/@me/reviews"
                >Reviews</router-link
              >
            </MenuItem>
            <MenuItem>
              <router-link
                class="hover:bg-gray-50 p-2 rounded-lg block"
                to="/users/@me/edit"
                >Edit Profile</router-link
              >
            </MenuItem>
          </div>
          <div class="px-1 py-1">
            <MenuItem>
              <a
                @click="userStore.logout"
                class="hover:bg-red-200 text-red-700 cursor-pointer p-2 rounded-lg block"
              >
                Logout
              </a>
            </MenuItem>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
    <div v-else class="welcome">
      <router-link to="/account/login">Login</router-link>
      <router-link to="/account/signup">Signup</router-link>
    </div>
  </header>
</template>

<style>
.welcome {
  @apply flex space-x-2 items-center;
}
.welcome a {
  @apply px-4 py-2 rounded bg-blue-600 text-white;
}
.welcome a:first-child {
  @apply bg-gray-200 text-black;
}
.welcome a:hover {
  @apply bg-opacity-90;
}
</style>
