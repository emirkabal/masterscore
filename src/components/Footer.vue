<script setup></script>

<template>
  <footer
    v-if="!$route.name?.startsWith('discover')"
    class="flex w-full flex-1 flex-col flex-wrap gap-16 border-t border-primary-foreground bg-gray-900/5 px-6 py-16 sm:px-24 xl:px-48 2xl:max-h-[690px] 2xl:flex-row 2xl:gap-x-48"
  >
    <div class="flex w-full max-w-[400px] flex-col gap-y-6">
      <div class="flex gap-6">
        <NuxtLink to="/">
          <Logo :small="true" class="h-12 w-auto" />
        </NuxtLink>
        <a
          class="group mt-2 flex items-center justify-center gap-x-3 text-xs tracking-tight opacity-75 hover:opacity-100 md:justify-start"
          href="https://emirkabal.com"
          >created by
          <IconsEKLogo
            class="inline h-5 w-auto transform-gpu transition-transform group-hover:-rotate-90"
        /></a>
      </div>
      <p class="max-w-[372px] pb-2 text-2xl font-bold tracking-tight text-white">
        {{ $t("footer.about") }}
      </p>
      <p class="pb-6 text-sm text-muted-foreground">
        <i18n-t keypath="footer.tmdb_text" scope="global">
          <template v-slot:provider>
            <a href="https://www.themoviedb.org/" rel="noopener noreferrer" target="_blank">
              <IconsTMDB class="-mt-0.5 inline h-2 w-auto" />
            </a>
          </template>
        </i18n-t>
      </p>
    </div>
    <div class="flex flex-wrap justify-between gap-8 sm:gap-16 2xl:w-[calc(100%_-_400px_-_12rem)]">
      <div class="min-w-[130px] space-y-6">
        <h6 class="text-sm font-medium text-muted-foreground">{{ $t("footer.pages") }}</h6>
        <ul class="links">
          <li>
            <NuxtLink to="/">{{ $t("header.home") }}</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/discover">{{ $t("discover.title") }}</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/feed">{{ $t("header.feed") }}</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/table">{{ $t("header.table") }}</NuxtLink>
          </li>
        </ul>
      </div>
      <div class="min-w-[130px] space-y-6">
        <h6 class="text-sm font-medium text-muted-foreground">{{ $t("footer.legal") }}</h6>
        <ul class="links">
          <li>
            <NuxtLink to="/privacy">{{ $t("legal.privacy-policy") }}</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/terms">{{ $t("legal.terms-of-service") }}</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/cookie">{{ $t("legal.cookie-policy") }}</NuxtLink>
          </li>
        </ul>
      </div>
      <div class="min-w-[130px] space-y-6">
        <h6 class="text-sm font-medium text-muted-foreground">{{ $t("footer.contact") }}</h6>
        <ul class="links">
          <li>
            <a href="mailto:support@masterscore.org">{{ $t("footer.support") }}</a>
          </li>
          <li>
            <a href="mailto:dmca@masterscore.org">{{ $t("footer.dmca-takedown") }}</a>
          </li>
        </ul>
      </div>
      <div class="min-w-[130px] space-y-6">
        <h6 class="text-sm font-medium text-muted-foreground">{{ $t("footer.social") }}</h6>
        <ul class="links">
          <li>
            <NuxtLink to="https://github.com/emirkabal/masterscore" external target="_blank"
              >Github</NuxtLink
            >
          </li>
          <li>
            <NuxtLink to="https://x.com/masterscoreorg" external target="_blank">Twitter</NuxtLink>
          </li>
        </ul>
      </div>
    </div>
    <div class="h-[1px] w-full bg-primary-foreground lg:mt-24"></div>
    <div class="flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
      <p class="text-sm text-muted-foreground">
        &copy; {{ new Date().getFullYear() }} Masterscore. {{ $t("footer.all-rights-reserved") }}
      </p>
      <LangSwitcher />
    </div>
  </footer>
</template>

<style scoped>
.links {
  @apply space-y-4;
}
.links li {
  @apply cursor-pointer opacity-75 transition-opacity hover:opacity-100;
}
</style>
