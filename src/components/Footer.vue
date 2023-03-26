<script setup>
import { useDark, useToggle } from "@vueuse/core"
const isDark = useDark()
const toggleDarkMode = useToggle(isDark)
const version = computed(() => {
  return "0.14.9-alpha"
})
const clickToShow = ref(0)
const date = useAppConfig().buildDate
</script>

<template>
  <div class="shadow-3xl mt-auto w-full bg-gray-50 py-4 dark:bg-zinc-900">
    <div
      class="container mx-auto flex flex-col items-center justify-between px-4 md:flex-row"
    >
      <div class="flex items-center gap-2">
        <NuxtLink to="/whoweare">
          <Logo class="text-xl" />
        </NuxtLink>
        <span class="text-xs opacity-75" @click="clickToShow++"
          >v{{ version }}</span
        >
        <span class="text-xs opacity-75" v-if="clickToShow > 2"
          >({{ date }})</span
        >
        <button
          class="text-gray-500 hover:text-gray-700"
          @click="toggleDarkMode()"
        >
          <template v-if="!isDark">
            <IconsSun class="w-6" />
          </template>
          <template v-else>
            <IconsMoon class="w-6" />
          </template>
        </button>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-gray-500 dark:text-gray-300">All data from</span>
        <a href="https://www.themoviedb.org/" target="_blank">
          <IconsTMDB class="w-28" />
        </a>
      </div>
    </div>
  </div>
</template>
