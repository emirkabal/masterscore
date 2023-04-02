<template>
  <div class="fixed z-20 flex h-screen items-center justify-center">
    <div
      class="flex h-auto w-auto -translate-x-12 flex-col items-center gap-2 rounded-br-xl rounded-tr-xl bg-gray-200 px-2 py-8 shadow-2xl drop-shadow-2xl transition-all hover:translate-x-0 dark:bg-zinc-950"
    >
      <NuxtLink
        to="/"
        class="rounded-full p-2 transition-colors hover:bg-gray-300 dark:hover:bg-zinc-900"
      >
        <IconsHome
          class="h-6 w-6"
          :class="{
            'fill-current': $route.path === '/'
          }"
        />
      </NuxtLink>
      <NuxtLink
        to="/feed"
        class="rounded-full p-2 transition-colors hover:bg-gray-300 dark:hover:bg-zinc-900"
      >
        <IconsFeed
          class="h-6 w-6"
          :class="{
            'fill-current': $route.path === '/feed'
          }"
        />
      </NuxtLink>
      <NuxtLink
        to="/table"
        class="rounded-full p-2 transition-colors hover:bg-gray-300 dark:hover:bg-zinc-900"
      >
        <IconsStar
          class="h-6 w-6"
          :class="{
            'fill-current': $route.path === '/table'
          }"
        />
      </NuxtLink>
    </div>
  </div>
</template>
