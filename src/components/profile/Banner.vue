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
    class="relative h-64 w-full bg-gray-500 bg-cover bg-center bg-no-repeat"
  >
    <div class="absolute bottom-0 right-0 m-4 flex gap-2">
      <router-link
        v-if="props.isMe"
        to="/users/@me/settings"
        class="rounded bg-white px-4 py-2 font-bold text-black transition-colors hover:bg-gray-50"
        >Edit Profile</router-link
      >
      <router-link
        v-if="props.viewProfile"
        :to="`/users/${props.username}`"
        class="rounded bg-white px-4 py-2 font-bold text-black transition-colors hover:bg-gray-50"
        >View Profile</router-link
      >
    </div>
    <div class="absolute -bottom-12 left-8 md:-bottom-16 md:left-10">
      <Avatar class="h-24 w-24 md:h-32 md:w-32" :username="props.username" />
    </div>
  </div>
</template>
