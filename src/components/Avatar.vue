<script setup>
const props = defineProps({
  username: {
    type: String,
    required: true
  },
  border: {
    type: Boolean,
    default: false
  }
})
</script>
<template>
  <div
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
