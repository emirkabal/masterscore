<script setup>
import { useUserStore } from "~/store/user"

const { user } = useUserStore()
const emits = defineEmits(["edit", "remove"])
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  data: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <div>
    <h1
      class="my-4 border-l-4 border-yellow-500 pl-4 text-2xl font-bold tracking-wide"
    >
      Latest Reviews
    </h1>
    <div class="space-y-4" v-if="props.loading">
      <div class="flex items-center px-4 py-6" v-for="i in 4" :key="i">
        <div
          class="skeleton-effect h-14 w-14 flex-shrink-0 rounded-full bg-gray-300 dark:bg-zinc-800"
        ></div>
        <div class="ml-4 flex w-full flex-col">
          <div
            class="skeleton-effect h-2 w-1/4 rounded bg-gray-300 dark:bg-zinc-800"
          ></div>
          <div
            class="skeleton-effect mt-1 h-2 w-1/2 rounded bg-gray-300 dark:bg-zinc-800"
          ></div>
          <div
            class="skeleton-effect mt-1 h-2 w-1/3 rounded bg-gray-300 dark:bg-zinc-800"
          ></div>
          <div
            class="skeleton-effect mt-1 h-2 w-1/4 rounded bg-gray-300 dark:bg-zinc-800"
          ></div>
        </div>
      </div>
    </div>
    <div v-else-if="data.length > 0">
      <div class="space-y-4">
        <div
          v-for="(comment, i) in data"
          :key="comment._id"
          class="flex items-start border-b px-2 py-4 dark:border-zinc-900 md:px-4 md:py-6"
        >
          <Avatar
            :username="comment.author.username"
            :avatar="comment.author.avatar"
            class="h-10 w-10 flex-shrink-0 md:h-14 md:w-14"
          />
          <div class="ml-4 flex w-full min-w-0 flex-col">
            <div class="flex w-full items-center justify-between gap-2">
              <div class="flex items-center gap-2 truncate">
                <NuxtLink
                  :to="`/users/@${comment.author.username}`"
                  class="line-clamp-1 flex items-center gap-1 font-semibold hover:underline"
                  >@{{ comment.author.username }}
                  <IconsVerified
                    v-if="comment.author.verified"
                    class="h-5 w-5 text-yellow-500"
                /></NuxtLink>
                <div class="hidden sm:block">
                  <p
                    class="line-clamp-1 break-words text-xs text-gray-500 dark:text-gray-300"
                  >
                    <span v-text="$moment(comment.createdAt).fromNow()"></span>
                    <span
                      v-if="comment.createdAt !== comment.updatedAt"
                      class="ml-1"
                      >(edited)</span
                    >
                  </p>
                </div>
              </div>

              <p class="flex items-center gap-1">
                <span class="text-sm font-semibold">{{ comment.rating }}</span>
                <IconsStarFilled class="h-4 w-4 text-yellow-400" />
              </p>
            </div>

            <ReviewContent :review="comment" />

            <div class="flex">
              <span
                class="line-clamp-1 block break-words text-xs text-gray-500 dark:text-gray-300 sm:hidden"
              >
                <span v-text="$moment(comment.createdAt).fromNow()"></span>
                <span v-if="comment.createdAt !== comment.updatedAt"
                  >(edited)</span
                >
              </span>
              <div
                v-if="comment.author._id === user?._id"
                class="ml-auto mt-0 flex items-center gap-2 sm:ml-0 sm:mt-2"
              >
                <button
                  @click="$emit('remove')"
                  class="ml-auto rounded bg-red-100 px-2 py-1 text-xs font-semibold text-red-500 shadow transition hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800"
                >
                  <IconsTrash class="h-4 w-4" />
                </button>
                <button
                  @click="$emit('edit')"
                  class="ml-auto rounded bg-white px-2 py-1 text-xs font-semibold shadow transition hover:bg-gray-50 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                >
                  <IconsPencil class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-gray-500 dark:text-gray-400">
        No reviews for this entertainment yet.
      </p>
    </div>
  </div>
</template>
