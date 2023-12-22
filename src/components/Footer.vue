<script setup>
import { useDark } from "@vueuse/core"
const isDark = useDark()
const version = computed(() => {
  return "3.0.0-alpha"
})
const date = useAppConfig().buildDate
isDark.value = true
</script>

<template>
  <footer
    class="mt-4 w-full gap-24 border-t border-gray-800 bg-gray-900/30 py-16"
    :class="{
      'mb-[59px]': $route.path.startsWith('/details/tv') || $route.path.startsWith('/details/movie')
    }"
  >
    <div
      class="max-w-8xl container mx-auto flex w-full flex-col-reverse justify-between gap-2 px-4 text-center md:flex-row md:text-left"
    >
      <div class="mx-auto flex flex-col md:mx-0">
        <div>
          <NuxtLink to="/">
            <Logo class="text-2xl" />
          </NuxtLink>
          <span
            class="text-xs text-gray-200"
            v-tooltip="{
              content: $moment(date).locale($i18n.locale).format('LLL')
            }"
            >v{{ version }}</span
          >
        </div>
        <p class="max-w-xs pb-2 text-sm text-gray-200">
          {{ $t("footer.about") }}
        </p>
        <p class="max-w-xs pb-6 text-xs opacity-50">
          <i18n-t keypath="footer.tmdb_text">
            <template v-slot:provider>
              <a href="https://www.themoviedb.org/" rel="noopener noreferrer" target="_blank">
                <IconsTMDB class="-mt-0.5 inline h-2 w-auto" />
              </a>
            </template>
          </i18n-t>
        </p>

        <p class="max-w-xs text-sm text-gray-300">
          &copy; {{ new Date().getFullYear() }} Masterscore
        </p>
        <a
          class="flex items-center justify-center gap-x-3 pt-4 text-xs tracking-tight opacity-90 hover:opacity-100 sm:hidden"
          href="https://emirkabal.com"
          >created by <IconsEKLogo class="inline h-6 w-auto"
        /></a>
      </div>
      <div class="flex flex-col items-center justify-center sm:items-end sm:justify-between">
        <LangSwitcher />
        <a
          class="group hidden items-center gap-x-3 text-xs tracking-tight opacity-90 hover:opacity-100 sm:flex"
          href="https://emirkabal.com"
          >created by
          <IconsEKLogo
            class="inline h-6 w-auto transform-gpu transition-transform group-hover:-rotate-90"
        /></a>
      </div>
    </div>
  </footer>
</template>
