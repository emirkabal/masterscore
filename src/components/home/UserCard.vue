<script setup lang="ts">
defineProps<{
  to: string
  subtitle: string
  user: {
    id: number
    display_name: string
    username: string
    avatar: string
    verified: boolean
  }
}>()
</script>

<template>
  <NuxtLink class="flex w-fit items-center gap-4 transition-opacity hover:opacity-75" :to="to">
    <Avatar
      class="size-10 sm:size-14"
      :username="user.username"
      :avatar="user.avatar"
      :square="user.verified"
    />
    <div>
      <div class="flex items-center gap-2">
        <h4 class="line-clamp-1 font-semibold tracking-tight sm:text-xl">
          {{ user.display_name || user.username }}
        </h4>
        <Icon
          v-if="user.verified"
          name="material-symbols:verified-rounded"
          class="size-4 flex-shrink-0 text-brand sm:size-6"
        />
      </div>
      <p class="text-sm tracking-tight opacity-75 sm:text-lg">{{ subtitle }}</p>
    </div>
  </NuxtLink>
</template>
