<script setup>
const version = useAppConfig().version
const date = useAppConfig().buildDate
</script>

<template>
  <footer
    v-if="!$route.name?.startsWith('discover')"
    class="w-full gap-24 border-t border-gray-800 bg-gray-900/30 py-16"
    :class="{
      'mb-[59px] lg:mb-0': $route.path.startsWith('/tv') || $route.path.startsWith('/movie')
    }"
  >
    <div
      class="max-w-8xl container mx-auto flex w-full flex-col-reverse justify-between gap-2 px-4 text-center md:flex-row md:text-left"
    >
      <div class="mx-auto flex flex-col md:mx-0">
        <div class="mb-1 flex w-full justify-center gap-x-2 md:justify-start">
          <NuxtLink to="/">
            <Logo />
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
          <i18n-t keypath="footer.tmdb_text" scope="global">
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

        <div class="mt-12 flex flex-wrap items-center justify-center gap-4 gap-y-2 md:hidden">
          <IconsVercel />

          <a
            class="flex items-center justify-center gap-x-3 text-xs tracking-tight opacity-90 hover:opacity-100"
            href="https://emirkabal.com"
            >created by <IconsEKLogo class="inline h-6 w-auto"
          /></a>

          <a
            class="flex items-center justify-center gap-x-2 text-xs tracking-tight opacity-90 hover:opacity-100"
            href="https://github.com/emirkabal/masterscore"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="mdi:github" class="h-8 w-8" />
            Open Source
          </a>
        </div>
      </div>
      <div class="flex flex-col items-center justify-center md:items-end md:justify-between">
        <LangSwitcher />
        <div class="hidden items-center gap-x-4 md:flex">
          <IconsVercel />

          <a
            class="flex items-center gap-x-2 text-xs tracking-tight opacity-90 hover:opacity-100"
            href="https://github.com/emirkabal/masterscore"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="mdi:github" class="h-8 w-8" />
            Open Source
          </a>
          <a
            class="group hidden items-center gap-x-3 text-xs tracking-tight opacity-90 hover:opacity-100 md:flex"
            href="https://emirkabal.com"
            >created by
            <IconsEKLogo
              class="inline h-6 w-auto transform-gpu transition-transform group-hover:-rotate-90"
          /></a>
        </div>
      </div>
    </div>
  </footer>
</template>
