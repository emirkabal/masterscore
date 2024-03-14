<script lang="ts" setup>
import { useLocalStorage } from "@vueuse/core"

const route = useRoute()
const username = computed(() => route.params.username as string)

const flags = useLocalStorage("preferences", {} as any)

const [user, summary] = await Promise.all([getUser(username.value), getUserSummary(username.value)])

useHead({
  title: user.display_name || user.username,
  titleTemplate: "%s - Masterscore"
})
</script>

<template>
  <section class="preffered-background min-h-screen">
    <div class="mx-auto max-w-6xl px-4 py-24">
      <PagesUserCard :user="user" />

      <div v-if="user.about" class="mt-8 rounded border-l-4 border-l-yellow-500 p-2 pl-6">
        <h2 class="font-semibold">
          {{ $t("settings.about") }}
        </h2>
        <p
          class="line-clamp-5 truncate whitespace-pre-wrap break-words text-gray-500 dark:text-gray-100"
        >
          {{ user.about }}
        </p>
      </div>

      <PagesUserSummary :summary="summary" />

      <ClientOnly v-if="flags.debug_mode">
        <div class="py-24">
          <JsonViewer
            :value="{
              user,
              summary
            }"
            copyable
            sort
            expanded
            theme="jsonviewer"
          />
        </div>
      </ClientOnly>
    </div>
  </section>
</template>
