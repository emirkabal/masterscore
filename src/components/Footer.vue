<script setup>
import { useDark } from "@vueuse/core"
const isDark = useDark()
const version = computed(() => {
  return "2.1.2-alpha"
})
const date = useAppConfig().buildDate
isDark.value = true
</script>

<template>
  <footer class="-mt-4 w-full gap-24 border-t border-zinc-900 py-16">
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
        <p class="max-w-xs border-t border-t-zinc-700 pt-2 text-xs opacity-75">
          <i18n-t keypath="footer.tmdb_text">
            <template v-slot:provider>
              <a
                href="https://www.themoviedb.org/"
                rel="noopener noreferrer"
                target="_blank"
              >
                <IconsTMDB class="-mt-0.5 inline h-2 w-auto" />
              </a>
            </template>
          </i18n-t>
        </p>
      </div>
      <LangSwitcher class="mx-auto md:mx-0" />
    </div>
  </footer>
</template>
