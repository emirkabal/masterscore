<script setup lang="ts">
const { data, pending } = await useLazyFetch<
  {
    _id: string
    username: string
    avatar?: string
  }[]
>("/api/feed/users")
</script>

<template>
  <div>
    <h1
      class="mb-4 border-l-4 border-green-500 pl-2 text-2xl font-bold tracking-wide"
    >
      Recent Joined
    </h1>
    <OverflowBehavior v-if="pending">
      <Avatar
        :loading="true"
        username="hello"
        class="my-3 h-16 w-16"
        v-for="i in 15"
        :key="i"
      />
    </OverflowBehavior>
    <OverflowBehavior v-else-if="data">
      <NuxtLink
        v-for="user in data"
        :key="user._id"
        :to="`/users/@${user.username}`"
        class="my-3 transition-opacity hover:opacity-75"
      >
        <Avatar
          class="h-16 w-16"
          :username="user.username"
          :avatar="user.avatar"
        />
      </NuxtLink>
    </OverflowBehavior>
  </div>
</template>
