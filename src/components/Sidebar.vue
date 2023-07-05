<script setup lang="ts">
import IconHome from "~/components/icons/Home.vue"
import IconFeed from "~/components/icons/Feed.vue"
import IconStar from "~/components/icons/Star.vue"

const routes = [
  {
    name: "Home",
    path: "/",
    icon: IconHome
  },
  {
    name: "Feed",
    path: "/feed",
    icon: IconFeed
  },
  {
    name: "Table",
    path: "/table",
    icon: IconStar
  }
]
</script>

<template>
  <div
    class="group pointer-events-none z-20 flex hidden h-screen w-14 flex-shrink-0 items-center justify-center"
  >
    <div
      class="pointer-events-auto fixed z-20 flex h-full w-14 origin-right flex-col items-center justify-center gap-2 rounded-br-xl rounded-tr-xl bg-gray-200 px-2 py-8 shadow-2xl drop-shadow-2xl transition-all hover:w-52 dark:bg-zinc-950"
    >
      <NuxtLink
        v-for="(route, i) in routes"
        :key="i"
        :to="route.path"
        class="flex gap-2 rounded-full p-2 transition-colors hover:bg-gray-300 dark:hover:bg-zinc-900"
      >
        <component
          :is="route.icon"
          class="h-6 w-6"
          :class="{
            'fill-current': $route.path === route.path
          }"
        />
        <span class="hidden text-lg font-semibold group-hover:block">
          {{ route.name }}
        </span>
      </NuxtLink>
    </div>
  </div>
</template>
