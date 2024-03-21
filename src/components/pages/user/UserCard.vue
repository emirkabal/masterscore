<script lang="ts" setup>
import type { APIUser } from "~/types"
const config = useRuntimeConfig()

const { user } = defineProps<{
  user: APIUser
  small?: boolean
  text?: string
}>()

const bannerUri = computed(() =>
  user.banner
    ? user.banner.startsWith("http")
      ? user.banner
      : `${config.public.SUPABASE_STORAGE_URL}banners/${user.banner}`
    : null
)
</script>

<template>
  <NuxtLink v-if="small" :to="`/${user.username}`" class="flex items-center gap-x-4 pb-4">
    <Avatar :username="user.username" :avatar="user.avatar" class="h-12 w-12" />
    <div>
      <h2 class="-mb-1 text-xl font-semibold tracking-tight">
        {{ user.display_name || user.username }}
      </h2>
      <span v-if="text" class="text-sm text-gray-300">
        {{ text }}
      </span>
    </div>
  </NuxtLink>
  <div v-else>
    <div class="banner">
      <MasterImage
        v-if="bannerUri"
        :source="bannerUri"
        class="aspect-banner max-h-96 w-full select-none rounded-3xl"
      />
      <div
        v-else
        class="aspect-banner max-h-24 w-full rounded-3xl bg-gradient-to-tl from-yellow-400 from-10% to-yellow-600"
      ></div>
    </div>
    <div class="user -mt-20 flex flex-col items-center md:flex-row md:pl-5">
      <div class="avatar relative">
        <Avatar
          :avatar="user.avatar"
          :username="user.username"
          class="h-[120px] w-[120px] rounded-full border-8 border-gray-900 align-top md:h-[160px] md:w-[160px]"
        />
      </div>
      <div class="details inline-block text-center md:ml-7 md:text-left">
        <div class="username mb-1 flex items-center gap-2 text-3xl font-semibold md:mt-24">
          <h1>{{ user.display_name || user.username }}</h1>
          <Verified v-if="user.verified" />
        </div>
        <h2 v-if="user.display_name" class="opacity-75">{{ user.username }}</h2>
      </div>
    </div>
  </div>
</template>
