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
      class="max-w-8xl container mx-auto flex w-full flex-col items-center justify-between gap-12 px-4 text-center md:flex-row md:text-left"
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
        <a
          class="group mt-2 flex items-center justify-center gap-x-3 text-xs tracking-tight opacity-75 hover:opacity-100 md:justify-start"
          href="https://emirkabal.com"
          >created by
          <IconsEKLogo
            class="inline h-5 w-auto transform-gpu transition-transform group-hover:-rotate-90"
        /></a>
      </div>
      <div class="flex flex-grow flex-wrap justify-around gap-12">
        <div class="space-y-2">
          <h6 class="font-medium">Pages</h6>
          <ul class="links">
            <li><NuxtLink to="/">Home</NuxtLink></li>
            <li><NuxtLink to="/discover">Discover</NuxtLink></li>
            <li><NuxtLink to="/feed">Feed</NuxtLink></li>
            <li><NuxtLink to="/table">Table</NuxtLink></li>
          </ul>
        </div>
        <div class="space-y-2">
          <h6 class="font-medium">Legal</h6>
          <ul class="links">
            <li><NuxtLink to="/terms">Terms of Service</NuxtLink></li>
            <li><NuxtLink to="/privacy">Privacy Policy</NuxtLink></li>
            <li><NuxtLink to="/cookie">Cookie Policy</NuxtLink></li>
          </ul>
        </div>
        <div class="space-y-2">
          <h6 class="font-medium">Social</h6>
          <ul class="links">
            <li>
              <NuxtLink to="https://github.com/emirkabal/masterscore" external target="_blank"
                >Github</NuxtLink
              >
            </li>
            <li>
              <NuxtLink to="https://x.com/masterscoreorg" external target="_blank"
                >Twitter</NuxtLink
              >
            </li>
          </ul>
        </div>
      </div>
      <div class="flex flex-col justify-end">
        <LangSwitcher />
      </div>
    </div>
  </footer>
</template>

<style scoped>
.links {
  @apply space-y-1.5;
}
.links li {
  @apply cursor-pointer opacity-75 hover:opacity-100;
}
</style>
