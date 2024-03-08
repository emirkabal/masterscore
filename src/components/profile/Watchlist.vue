<script setup lang="ts">
import type { IEntertainment } from "~/types"

defineProps<{
  self?: boolean
  watchlist: {
    pending: boolean
    items: IEntertainment[]
  }
}>()

const emit = defineEmits(["remove"])

const removeItem = async (id: any) => {
  $fetch(`/api/users/me/watchlist`, {
    method: "POST",
    body: JSON.stringify({
      id,
      type: "remove"
    })
  })

  emit("remove", id)
}
</script>

<template>
  <div class="mt-12">
    <div v-if="watchlist.pending" class="flex flex-col gap-6">
      <div v-for="i in 10" :key="i">
        <div class="flex items-start">
          <div
            class="skeleton-effect mr-4 h-16 w-10 rounded bg-gray-300 md:h-24 md:w-16 dark:bg-gray-900"
          ></div>

          <div class="flex flex-col gap-2">
            <div class="skeleton-effect h-3 w-24 rounded bg-gray-300 dark:bg-gray-900"></div>
            <div class="skeleton-effect h-2 w-32 rounded bg-gray-300 dark:bg-gray-900"></div>
            <div class="skeleton-effect h-2 w-12 rounded bg-gray-300 dark:bg-gray-900"></div>
            <div class="skeleton-effect h-2 w-20 rounded bg-gray-300 dark:bg-gray-900"></div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="watchlist.items.length === 0" class="flex justify-center">
      <p class="text-gray-500 dark:text-gray-200">Watchlist is empty.</p>
    </div>
    <div class="flex flex-col gap-6" v-else>
      <div v-for="entertainment in watchlist.items" :key="entertainment._id">
        <div class="flex items-start overflow-hidden rounded">
          <NuxtLink :to="`/${entertainment.type}/${entertainment.id}`">
            <MasterImage
              v-if="entertainment.info.poster"
              :source="$timage(entertainment.info.poster, 'w92')"
              class="mr-4 h-16 w-10 rounded-lg md:h-24 md:w-16"
            />
          </NuxtLink>

          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <NuxtLink
                :to="`/${entertainment.type}/${entertainment.id}`"
                class="line-clamp-1 font-semibold hover:underline"
              >
                {{ entertainment.info.title }}
              </NuxtLink>
            </div>
            <span class="text-sm opacity-90">
              {{ $moment(entertainment.info.release_date).locale($i18n.locale).format("YYYY") }}
            </span>
          </div>
          <button
            v-if="self"
            @click="removeItem(entertainment._id)"
            class="ml-auto transition-opacity hover:opacity-75"
          >
            <Icon name="ic:round-close" class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
