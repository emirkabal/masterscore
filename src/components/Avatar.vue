<script setup lang="ts">
const config = useRuntimeConfig()

const imageLoading = ref(true)

const props = defineProps<{
  username: string
  avatar?: string | null
  border?: boolean
  loading?: boolean
  square?: boolean
  verified?: boolean
  minimize?: boolean
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
    ? props.avatar.length > 250
      ? props.avatar
      : `${config.public.SUPABASE_STORAGE_URL}avatars/${props.avatar}`
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
    isAlpha.value = detectAlphaPixel(avatarReference.value.$el, 0, 0)
  }
})
</script>
<template>
  <div
    v-if="loading"
    class="skeleton-effect flex-shrink-0 bg-gray-900"
    :class="{
      'rounded-full': !square,
      'rounded-lg': square
    }"
  ></div>
  <div
    v-else
    class="relative flex flex-shrink-0 items-center justify-center bg-gray-800"
    :class="{
      'outline outline-4 outline-zinc-700': border,
      'rounded-full': !square,
      'rounded-lg': square,
      'overflow-hidden': loading || imageLoading
    }"
    v-bind="$attrs"
  >
    <span class="skeleton-effect h-full w-full bg-gray-900" v-if="imageLoading && !loading"> </span>
    <div
      v-if="verified"
      class="m absolute bottom-0 right-0 -m-1.5 flex h-10 w-10 items-center justify-center rounded-full bg-gray-950 p-1"
      :class="{
        'h-6 w-6 !bg-gray-900': minimize
      }"
    >
      <Icon
        name="material-symbols:verified-rounded"
        class="h-6 w-6 text-brand"
        :class="{
          'h-4 w-4': minimize
        }"
      />
    </div>
    <nuxt-img
      ref="avatarReference"
      :src="avatar"
      loading="lazy"
      :alt="props.username"
      class="h-full w-full"
      @load="imageLoading = false"
      :onload="() => (imageLoading = false)"
      crossorigin="anonymous"
      :class="{
        'pointer-events-none absolute inset-0 opacity-0': imageLoading && !loading,
        'rounded-full': !square,
        'rounded-lg': square
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
