<script setup lang="ts">
const config = useRuntimeConfig()

const imageLoading = ref(true)

const props = defineProps<{
  username: string
  avatar?: string | null
  border?: boolean
  loading?: boolean
  square?: boolean
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

const isAlpha = ref(false)

const avatarReference = ref()

const detectAlphaPixel = (img: HTMLImageElement, x: number, y: number) => {
  const canvas = document.createElement("canvas")
  if (!canvas) return false
  canvas.width = 1
  canvas.height = 1
  const context = canvas.getContext("2d")
  if (!context) return false
  context.drawImage(img, x, y, 1, 1, 0, 0, 1, 1)
  const data = context.getImageData(0, 0, 1, 1).data
  return data[3] === 0
}

watch(imageLoading, () => {
  if (avatarReference.value && props.square && props.avatar) {
    isAlpha.value = detectAlphaPixel(avatarReference.value, 0, 0)
  }
})
</script>
<template>
  <div
    v-if="loading"
    class="skeleton-effect flex-shrink-0 bg-gray-300 dark:bg-zinc-800"
    :class="{
      'rounded-full': !square,
      'rounded-lg': square
    }"
  ></div>
  <div
    v-else
    class="flex flex-shrink-0 items-center justify-center overflow-hidden bg-gray-200 dark:bg-gray-800"
    :class="{
      'outline outline-4 outline-gray-300 dark:outline-zinc-700': border,
      'rounded-full': !square,
      'rounded-lg': square
    }"
  >
    <span
      class="skeleton-effect h-full w-full bg-gray-400 dark:bg-zinc-900"
      v-if="imageLoading && !loading"
    >
    </span>
    <img
      ref="avatarReference"
      :src="avatar"
      loading="lazy"
      :alt="props.username"
      class="h-full w-full"
      @load="imageLoading = false"
      crossorigin="anonymous"
      :class="{
        'pointer-events-none absolute inset-0 opacity-0':
          imageLoading && !loading,
        'rounded-full': !square,
        'rounded-lg': square,
        'scale-125': isAlpha
      }"
      draggable="false"
    />
  </div>
</template>

<style>
.avatar {
  width: var(--size);
  height: var(--size);
}
</style>
