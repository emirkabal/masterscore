<script setup>
import { useDark, useToggle } from "@vueuse/core"
const isDark = useDark()
const toggleDarkMode = useToggle(isDark)
</script>

<template>
  <div class="mt-auto bg-gray-50 dark:bg-zinc-900 shadow-3xl w-full py-4">
    <div
      class="container mx-auto px-4 flex md:flex-row flex-col items-center justify-between"
    >
      <div class="flex items-center gap-2">
        <Logo class="text-xl" />
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
      <div class="flex gap-2 items-center">
        <span class="text-gray-500 dark:text-gray-300"
          >Movies & TV Shows from</span
        >
        <a href="https://www.themoviedb.org/" target="_blank">
          <IconsTMDB class="w-28" />
        </a>
      </div>
    </div>
  </div>
</template>
