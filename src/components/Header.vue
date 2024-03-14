<script setup>
import { useUserStore } from "~/store/user"
import { onClickOutside, useScroll } from "@vueuse/core"
const isMenuOpen = ref(false)
const isHeaderHidden = ref(false)
const { $listen } = useNuxtApp()
const route = useRoute()
const scroll = useScroll(window)
const menuRef = ref(null)
const searchFocus = ref(false)
onClickOutside(menuRef, () => {
  isMenuOpen.value = false
})
const userStore = useUserStore()
const entertainment = reactive({
  bright: false,
  loaded: false
})
const top = ref(false)

const isHeaderShown = computed(() => {
  return top.value
})

const isBottomAndHidden = computed(() => {
  return scroll.y.value > 0 && !isHeaderShown.value
})

watch(
  () => scroll.y.value,
  () => {
    if (scroll.y.value === 0) top.value = false
    else if (scroll.directions.top) top.value = true
    else if (scroll.directions.bottom) top.value = false
  }
)

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

$listen("searchbar:focus", (val) => {
  searchFocus.value = val
})
</script>

<template>
  <header
    class="absolute top-0 z-30 flex h-16 w-full items-center justify-between px-4 transition-all md:px-6"
    :class="{
      hidden: isHeaderHidden,
      'enter-animation !fixed  bg-gray-900': isHeaderShown,
      '!fixed  -top-14': isBottomAndHidden
    }"
  >
    <div class="flex w-full items-center justify-between">
      <div
        class="flex items-center"
        :class="{
          'w-0 opacity-0 md:w-auto md:opacity-100': searchFocus
        }"
      >
        <NuxtLink
          to="/"
          @click="entertainment.bright = false"
          class="select-none font-maven text-2xl font-black transition hover:opacity-75"
          :class="{
            'drop-shadow-md': isEntertainmentPage && !isHeaderShown,
            'text-black': entertainment.bright && !isHeaderShown && isEntertainmentPage,
            'text-white':
              (!entertainment.bright && !isHeaderShown && isEntertainmentPage) ||
              ($route.name === 'index' && !isHeaderShown)
          }"
          ><Logo class="h-4 w-auto lg:h-5" :small="!$device.isDesktop"
        /></NuxtLink>
      </div>
      <Searchbar
        :class="{
          'mx-4 md:mx-0': !searchFocus
        }"
      />
      <div
        class="flex flex-shrink-0"
        :class="{
          'w-0 opacity-0 md:w-auto md:opacity-100': searchFocus
        }"
      >
        <div v-if="userStore.isLoading" class="flex gap-2">
          <Spinner />
        </div>
        <HeadlessMenu
          as="div"
          class="relative z-10 inline-block text-left"
          v-else-if="userStore.isLoggedIn"
          ref="menuRef"
        >
          <div>
            <HeadlessMenuButton @click="isMenuOpen = !isMenuOpen"
              ><Avatar
                :username="userStore.user.username"
                :avatar="userStore.user.avatar"
                class="mt-1.5 h-10 w-10 hover:opacity-90"
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
                class="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-900 rounded-md border border-gray-800 bg-gray-950 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <div class="flex items-center gap-x-1 px-3 py-2">
                  <span class="block tracking-tight text-gray-200">{{
                    userStore.user.username
                  }}</span>
                  <Icon
                    v-if="userStore.user.verified"
                    name="material-symbols:verified-rounded"
                    class="h-5 w-5 flex-shrink-0 text-brand"
                  />
                </div>
                <div class="px-1 py-1">
                  <HeadlessMenuItem>
                    <NuxtLink
                      class="block rounded-lg p-2 hover:bg-gray-900"
                      :to="`/${userStore.user.username}`"
                      >{{ $t("header.user.profile") }}</NuxtLink
                    >
                  </HeadlessMenuItem>

                  <HeadlessMenuItem>
                    <NuxtLink
                      class="block rounded-lg p-2 hover:bg-gray-900"
                      :to="`/${userStore.user.username}/reviews`"
                      >{{ $t("header.user.reviews") }}</NuxtLink
                    >
                  </HeadlessMenuItem>
                  <HeadlessMenuItem>
                    <NuxtLink class="block rounded-lg p-2 hover:bg-gray-900" to="/settings">{{
                      $t("header.user.settings")
                    }}</NuxtLink>
                  </HeadlessMenuItem>
                </div>
                <div class="px-1 py-1">
                  <HeadlessMenuItem>
                    <a
                      @click="userStore.logout"
                      class="block cursor-pointer rounded-lg p-2 font-semibold text-red-700 hover:bg-red-200/10"
                    >
                      {{ $t("header.user.logout") }}
                    </a>
                  </HeadlessMenuItem>
                </div>
              </HeadlessMenuItems>
            </div>
          </Transition>
        </HeadlessMenu>
        <NuxtLink
          v-else
          to="/account/login"
          class="w-full flex-grow items-center rounded bg-yellow-500 px-4 py-2 font-semibold text-black transition-colors hover:bg-yellow-600"
          >{{ $t("guest.sign_in") }}</NuxtLink
        >
      </div>
    </div>
  </header>
</template>

<style scoped>
@keyframes enter {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

.enter-animation {
  animation: enter 0.2s ease-out;
}
</style>
