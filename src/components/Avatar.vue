<script setup lang="ts">
const config = useRuntimeConfig()

const imageLoading = ref(true)

const props = defineProps<{
  username: string
  avatar?: string | null
  border?: boolean
  loading?: boolean
}>()

const defaultAvatar = computed(() => {
  return (
    "https://api.dicebear.com/5.x/thumbs/svg?seed=" +
    props.username +
    "&scale=90&backgroundColor=transparent"
  )
})

const avatar = computed(() => {
  return props.avatar
    ? `${config.public.SUPABASE_STORAGE_URL}${props.avatar}`
    : defaultAvatar.value
})
</script>
<template>
  <div
    v-if="loading"
    class="skeleton-effect flex-shrink-0 rounded-full bg-gray-300 dark:bg-zinc-800"
  ></div>
  <div
    v-else
    class="flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
    :class="{
      'outline outline-4 outline-gray-300 dark:outline-zinc-700': border
    }"
  >
    <span
      class="skeleton-effect h-full w-full bg-gray-400 dark:bg-zinc-900"
      v-if="imageLoading && !loading"
    >
    </span>
    <nuxt-img
      :src="avatar"
      loading="lazy"
      class="h-full w-full rounded-full"
      :class="{
        'absolute opacity-0': imageLoading && !loading
      }"
      draggable="false"
      @load="imageLoading = false"
    />
  </div>
</template>

<style>
.avatar {
  width: var(--size);
  height: var(--size);
}
</style>
