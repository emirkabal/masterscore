<script setup>
import { useDark, useToggle, onKeyStroke } from "@vueuse/core"
const isDark = useDark()
const localePath = useLocalePath()
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const version = computed(() => {
  return "2.0.1-alpha"
})
const clickToShow = ref(0)
const date = useAppConfig().buildDate
isDark.value = true

const availableLocales = computed(() => {
  return locales.value.filter((i) => i.code !== locale.value)
})
</script>

<template>
  <div class="shadow-3xl mt-auto w-full bg-gray-50 py-4 dark:bg-zinc-900">
    <div
      class="container mx-auto flex flex-col items-center justify-between px-4 md:flex-row"
    >
      <div class="flex items-center gap-2">
        <NuxtLink :to="localePath('/whoweare')">
          <Logo class="text-xl" />
        </NuxtLink>
        <span class="text-xs opacity-75" @click="clickToShow++"
          >v{{ version }}</span
        >
        <span class="text-xs opacity-75" v-if="clickToShow > 2"
          >({{ date }})</span
        >
        <NuxtLink
          v-for="locale in availableLocales"
          :key="locale.code"
          :to="switchLocalePath(locale.code)"
          >{{ locale.name }}</NuxtLink
        >
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
