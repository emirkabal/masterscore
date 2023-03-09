<script setup>
import { useUserStore } from "~~/src/store/user"

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
      <div
        class="flex animate-pulse items-center px-4 py-6"
        v-for="i in 4"
        :key="i"
      >
        <div
          class="h-14 w-14 flex-shrink-0 rounded-full bg-gray-300 dark:bg-zinc-800"
        ></div>
        <div class="ml-4 flex w-full flex-col">
          <div class="h-2 w-1/4 rounded bg-gray-300 dark:bg-zinc-800"></div>
          <div
            class="mt-2 h-2 w-1/2 rounded bg-gray-300 dark:bg-zinc-800"
          ></div>
          <div
            class="mt-1 h-2 w-1/3 rounded bg-gray-300 dark:bg-zinc-800"
          ></div>
          <div
            class="mt-1 h-2 w-1/4 rounded bg-gray-300 dark:bg-zinc-800"
          ></div>
        </div>
      </div>
    </div>
    <div v-else-if="data.length > 0">
      <div class="space-y-4">
        <div
          v-for="(comment, i) in data"
          :key="i"
          class="flex items-start border-b px-2 py-4 dark:border-zinc-900 md:px-4 md:py-6"
        >
          <Avatar
            :username="comment.author.username"
            class="h-10 w-10 flex-shrink-0 md:h-14 md:w-14"
          />
          <div class="ml-4 flex flex-col">
            <div class="flex items-center gap-2">
              <router-link
                :to="`/users/@${
                  comment.author._id == user?._id
                    ? 'me'
                    : comment.author.username
                }`"
                class="text-base font-semibold hover:underline md:text-lg"
              >
                @{{ comment.author.username }}
              </router-link>
              <p class="flex items-center gap-1">
                <IconsStarFilled class="h-4 w-4 text-yellow-400" />
                <span class="text-sm font-semibold">{{ comment.rating }}</span>
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 md:text-base">
                {{ $moment(comment.createdAt).fromNow() }}
                {{ comment.createdAt === comment.updatedAt ? "" : "(edited)" }}
              </p>
            </div>

            <p
              class="truncate whitespace-normal break-all text-base"
              :class="{
                'text-gray-500 dark:text-gray-300': !comment.content
              }"
            >
              {{
                comment.content
                  ? comment.content
                  : "No comment for this review."
              }}
            </p>
          </div>
          <div class="ml-auto flex items-center gap-2">
            <button
              v-if="comment.author._id === user?._id"
              @click="$emit('remove')"
              class="ml-auto rounded bg-red-100 px-2 py-1 text-xs font-semibold text-red-500 shadow transition hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800"
            >
              <IconsTrash class="h-4 w-4" />
            </button>
            <button
              v-if="comment.author._id === user?._id"
              @click="$emit('edit')"
              class="ml-auto rounded bg-white px-2 py-1 text-xs font-semibold shadow transition hover:bg-gray-50 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            >
              <IconsPencil class="h-4 w-4" />
            </button>
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
