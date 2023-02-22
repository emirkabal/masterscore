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
    class="overflow-hidden rounded-full border-4 dark:border-black flex items-center justify-center bg-white dark:bg-black"
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
