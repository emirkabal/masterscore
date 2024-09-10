<script setup>
import { useUserStore } from "~/store/user"
import { onClickOutside, useScroll } from "@vueuse/core"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

const isMenuOpen = ref(false)
const isHeaderHidden = ref(false)
const { $listen } = useNuxtApp()
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
  return top.value || (searchFocus.value && scroll.y.value > 0)
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
  <nav
    class="absolute top-0 z-30 flex h-16 w-full items-center justify-between px-4 transition-all md:px-6"
    :class="{
      hidden: isHeaderHidden,
      'enter-animation !fixed bg-gray-900': isHeaderShown,
      '!fixed !-top-14': isBottomAndHidden
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
          class="flex select-none font-maven text-2xl font-black transition hover:opacity-75"
          :class="{
            'drop-shadow-md': isEntertainmentPage && !isHeaderShown,
            'text-black': entertainment.bright && !isHeaderShown && isEntertainmentPage,
            'text-white':
              (!entertainment.bright && !isHeaderShown && isEntertainmentPage) ||
              ($route.name === 'index' && !isHeaderShown)
          }"
        >
          <span class="text-brand"> m </span>
          <span class="hidden lg:block">asterscore</span>
        </NuxtLink>
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
        <div v-if="userStore.token && userStore.isLoading" class="flex gap-2">
          <Spinner />
        </div>
        <DropdownMenu v-else-if="userStore.isLoggedIn">
          <DropdownMenuTrigger as-child>
            <Avatar
              :username="userStore.user.username"
              :avatar="userStore.user.avatar"
              class="mt-1.5 h-10 w-10 cursor-pointer hover:opacity-90"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-56" :sideOffset="12" :collisionPadding="{ right: 24 }">
            <DropdownMenuLabel class="flex items-center gap-x-1">
              <span class="block text-gray-100">{{ userStore.user.username }}</span>
              <Icon
                v-if="userStore.user.verified"
                name="material-symbols:verified-rounded"
                class="h-5 w-5 flex-shrink-0 text-brand"
              />
              <Logo small class="h-5 w-5 flex-shrink-0" v-if="userStore.user.flags === 1" />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem as-child>
                <NuxtLink :to="`/${userStore.user.username}`">
                  <Icon name="material-symbols:person-outline" class="mr-2 h-4 w-4" />
                  <span>{{ $t("header.user.profile") }}</span>
                </NuxtLink>
              </DropdownMenuItem>
              <DropdownMenuItem as-child>
                <NuxtLink :to="`/${userStore.user.username}/reviews`">
                  <Icon name="material-symbols:reviews-outline" class="mr-2 h-4 w-4" />
                  <span>{{ $t("header.user.reviews") }}</span>
                </NuxtLink>
              </DropdownMenuItem>
              <DropdownMenuItem as-child>
                <NuxtLink to="/settings">
                  <Icon name="material-symbols:settings-outline" class="mr-2 h-4 w-4" />
                  <span>{{ $t("header.user.settings") }}</span>
                </NuxtLink>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <template v-if="userStore.user.flags === 1">
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Icon name="material-symbols:admin-panel-settings" class="mr-2 h-4 w-4" />
                    <span>Staff Tools</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>
                        <Icon name="material-symbols:admin-panel-settings" class="mr-2 h-4 w-4" />
                        <span>DMCA Takedowns</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Icon name="material-symbols:admin-panel-settings" class="mr-2 h-4 w-4" />
                        <span>Suspended Users</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Icon name="material-symbols:admin-panel-settings" class="mr-2 h-4 w-4" />
                        <span>More...</span>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
            </template>
            <DropdownMenuSeparator />
            <DropdownMenuItem as-child>
              <NuxtLink external to="https://github.com/emirkabal/masterscore" target="_blank">
                <Icon name="simple-icons:github" class="mr-2 h-4 w-4" />
                <span>GitHub</span>
              </NuxtLink>
            </DropdownMenuItem>
            <DropdownMenuItem as-child>
              <NuxtLink external to="mailto:support@masterscore.org" target="_blank">
                <Icon name="material-symbols:support-agent" class="mr-2 h-4 w-4" />
                <span>{{ $t("footer.support") }}</span>
              </NuxtLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem @click="userStore.logout">
              <Icon name="material-symbols:logout" class="mr-2 h-4 w-4" />
              <span>{{ $t("header.user.logout") }}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <NuxtLink
          v-else
          to="/account/login"
          class="w-full flex-grow items-center rounded bg-yellow-500 px-4 py-2 font-semibold text-black transition-colors hover:bg-yellow-600"
          >{{ $t("guest.sign_in") }}</NuxtLink
        >
      </div>
    </div>
  </nav>
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
