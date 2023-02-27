<script setup>
const props = defineProps({
  username: {
    type: String,
    required: true
  }
})
</script>
<template>
  <div
    class="flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-4 bg-gray-900 dark:border-zinc-800"
  >
    <img
      :src="'https://api.dicebear.com/5.x/thumbs/svg?seed=' + props.username"
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
