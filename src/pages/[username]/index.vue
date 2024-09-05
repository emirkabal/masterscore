<script lang="ts" setup>
const route = useRoute()
const username = computed(() => route.params.username as string)

const preferences = usePreferences()

const [user, summary] = await Promise.all([getUser(username.value), getUserSummary(username.value)])
if (!user)
  throw createError({
    statusCode: 404,
    message: "User not found"
  })

const title = user.display_name ? `${user.display_name} (${user.username})` : user.username
useSeoMeta({
  title,
  titleTemplate: "%s - Masterscore",
  description: user.about,
  ogTitle: title,
  ogDescription: user.about,
  twitterCard: "summary",
  twitterTitle: title,
  twitterDescription: user.about,
  ogUrl: `https://masterscore.org/${user.username}`
})
</script>

<template>
  <section class="preffered-background min-h-screen">
    <div class="mx-auto max-w-6xl px-4 py-24">
      <PagesUserCard v-if="user" :user="user" />

      <div v-if="user.about" class="mt-8 rounded border-l-4 border-l-yellow-500 p-2 pl-6">
        <h2 class="font-semibold">
          {{ $t("settings.about") }}
        </h2>
        <p class="line-clamp-5 truncate whitespace-pre-wrap break-words text-gray-100">
          {{ user.about }}
        </p>
      </div>

      <PagesUserSummary :user="user" :summary="summary" />

      <ClientOnly v-if="preferences.debug_mode">
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
