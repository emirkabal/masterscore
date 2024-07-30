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
      class="h-14 w-14"
      :username="user.username"
      :avatar="user.avatar"
      :square="user.verified"
    />
    <div>
      <div class="flex items-center gap-2">
        <h4 class="line-clamp-1 text-xl font-semibold tracking-tight">
          {{ user.display_name || user.username }}
        </h4>
        <Icon
          v-if="user.verified"
          name="material-symbols:verified-rounded"
          class="h-6 w-6 text-brand"
        />
      </div>
      <p class="text-lg tracking-tight opacity-75">{{ subtitle }}</p>
    </div>
  </NuxtLink>
</template>
