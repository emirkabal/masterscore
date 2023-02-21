<script setup>
const props = defineProps({
  banner: {
    type: String || undefined || null,
    required: false
  },
  username: {
    type: String,
    required: true
  },
  isMe: {
    type: Boolean,
    required: false,
    default: false
  },
  viewProfile: {
    type: Boolean,
    required: false,
    default: false
  }
})
</script>
<template>
  <div
    :style="`background-image: url(${props.banner})`"
    class="w-full h-64 bg-gray-500 relative bg-cover bg-center"
  >
    <div class="absolute bottom-0 right-0 m-4 flex gap-2">
      <router-link
        v-if="props.isMe"
        to="/users/@me/edit"
        class="px-4 py-2 rounded hover:bg-gray-50 bg-white text-black font-bold transition-colors"
        >Edit Profile</router-link
      >
      <router-link
        v-if="props.viewProfile"
        :to="`/users/${props.username}`"
        class="px-4 py-2 rounded hover:bg-gray-50 bg-white text-black font-bold transition-colors"
        >View Profile</router-link
      >
    </div>
    <div class="absolute md:-bottom-16 md:left-10 -bottom-12 left-8">
      <Avatar class="md:w-32 md:h-32 w-24 h-24" :username="props.username" />
    </div>
  </div>
</template>
