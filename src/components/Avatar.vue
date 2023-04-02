<script setup>
const props = defineProps({
  username: {
    type: String,
    required: true
  },
  border: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
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
    <img
      :src="
        'https://api.dicebear.com/5.x/thumbs/svg?seed=' +
        props.username +
        '&scale=90&backgroundColor=transparent'
      "
      class="rounded-full"
      draggable="false"
      alt="User Avatar"
    />
  </div>
</template>

<style>
.avatar {
  width: var(--size);
  height: var(--size);
}
</style>
