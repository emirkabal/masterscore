<script setup lang="ts">
import { useUserStore } from "~/store/user"

const { user } = useUserStore()
const emits = defineEmits(["edit", "remove"])
withDefaults(
  defineProps<{
    data?: any[]
    loading?: boolean
    mranking?: {
      total: number
      rating: number
      good: number
      poor: number
    }
  }>(),
  {
    data: () => [],
    loading: false
  }
)

const test = ref(false)
</script>

<template>
  <div class="px-4">
    <h1
      v-if="!loading"
      class="my-4 border-l-4 border-yellow-500 pl-4 text-2xl font-bold tracking-wide"
    >
      {{ $t("entertainment.reviews") }}
    </h1>
    <!-- <div v-if="mranking?.good">
      <EntertainmentMRanking :rating="mranking.rating" class="w-fit" />
      <p class="text-gray-500 dark:text-gray-400">{{ $t("total") }}: {{ mranking.total }}</p>
      <p class="flex flex-wrap gap-x-4">
        <span class="text-green-500 dark:text-green-400">
          {{
            $t("mranking.reviewers_positive", [
              mranking.good,
              ((mranking.good * 100) / mranking.total).toFixed(2)
            ])
          }}
        </span>
        <span class="text-red-500 dark:text-red-400">
          {{
            $t("mranking.reviewers_negative", [
              mranking.poor,
              ((mranking.poor * 100) / mranking.total).toFixed(2)
            ])
          }}
        </span>
      </p>
    </div> -->
    <div v-if="loading">
      <div class="skeleton-effect my-2 h-6 w-32 rounded bg-gray-300 dark:bg-gray-900"></div>
      <div class="flex items-center px-4 py-6" v-for="i in 4" :key="i">
        <div
          class="skeleton-effect h-14 w-14 flex-shrink-0 rounded-full bg-gray-300 dark:bg-gray-900"
        ></div>
        <div class="ml-4 flex w-full flex-col">
          <div class="skeleton-effect h-2 w-1/4 rounded bg-gray-300 dark:bg-gray-900"></div>
          <div class="skeleton-effect mt-1 h-2 w-1/2 rounded bg-gray-300 dark:bg-gray-900"></div>
          <div class="skeleton-effect mt-1 h-2 w-1/3 rounded bg-gray-300 dark:bg-gray-900"></div>
          <div class="skeleton-effect mt-1 h-2 w-1/4 rounded bg-gray-300 dark:bg-gray-900"></div>
        </div>
      </div>
    </div>
    <div v-else-if="data.length > 0">
      <div class="flex flex-col gap-y-12">
        <div v-for="comment in data" :key="comment._id" class="flex items-start gap-x-4 rounded-xl">
          <NuxtLink :to="`/users/@${comment.author.username}`">
            <Avatar
              :username="comment.author.username"
              :avatar="comment.author.avatar"
              :square="comment.author.verified"
              class="h-10 w-10 flex-shrink-0 md:h-14 md:w-14"
            />
          </NuxtLink>

          <div class="flex w-full min-w-0 flex-col">
            <!-- <span class="text-sm opacity-90">
              {{ $t("entertainment.reviewed") }}: {{ comment.rating }}/10
            </span> -->

            <div class="flex items-center gap-x-1.5">
              <NuxtLink
                :to="`/users/${comment.author.username}`"
                class="flex min-w-0 items-center gap-1 font-semibold transition hover:opacity-85"
              >
                <span class="truncate break-words"> {{ comment.author.username }} </span>
                <Icon
                  v-if="comment.author.verified"
                  name="material-symbols:verified-rounded"
                  class="text-brand h-5 w-5 flex-shrink-0"
              /></NuxtLink>
              <ScoreCircle :score="comment.rating" />
              <p
                class="line-clamp-1 flex-shrink-0 cursor-default break-words text-xs text-gray-500 dark:text-gray-300"
              >
                <span
                  v-tooltip="{
                    content: $moment(comment.createdAt).locale($i18n.locale).format('LLLL')
                  }"
                  v-text="$moment(comment.createdAt).locale($i18n.locale).calendar()"
                ></span>
                <span
                  v-if="comment.createdAt !== comment.updatedAt"
                  v-tooltip="{
                    content: $moment(comment.updatedAt).locale($i18n.locale).format('LLLL')
                  }"
                  class="ml-1"
                  >({{ $t("edited") }})</span
                >
              </p>

              <!-- <EntertainmentMRanking :rating="comment.rating" class="w-fit" /> -->
            </div>
            <ReviewContent :review="comment" class="mt-1" />

            <div class="mt-2">
              <div v-if="comment.content" class="flex gap-x-4">
                <button
                  v-if="!test"
                  @click="test = true"
                  class="flex h-8 w-8 items-center justify-center gap-x-1 rounded-full bg-gray-800 text-sm transition hover:bg-gray-700"
                >
                  <Icon name="ph:arrow-fat-up" />
                  <!-- <Icon name="ph:arrow-fat-up-fill" /> -->
                </button>
                <button
                  v-else
                  @click="test = false"
                  class="flex h-8 items-center justify-center gap-x-1 rounded-full bg-orange-500/20 px-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-500/40"
                >
                  <!-- <Icon name="ph:arrow-fat-down" /> -->
                  <Icon name="ph:arrow-fat-up-fill" />
                  <!-- <Icon name="ph:arrow-fat-up" /> -->
                  <span> 256 </span>
                </button>
              </div>

              <!-- <button v-if="comment.author._id === user?._id">
                <Icon name="mdi:dots-horizontal" class="h-6 w-6 rotate-90 md:rotate-0" />
              </button> -->
              <!-- <div
                v-if="comment.author._id === user?._id"
                class="ml-auto mt-0 flex items-center gap-2 sm:ml-0 sm:mt-2"
              >
                <button
                  @click="$emit('edit')"
                  class="ml-auto rounded bg-white px-2 py-1 text-xs font-semibold shadow transition hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-zinc-700"
                >
                  <Icon name="ic:round-edit" class="h-4 w-4" />
                </button>
                <button
                  @click="$emit('remove')"
                  class="ml-auto rounded bg-red-100 px-2 py-1 text-xs font-semibold text-red-500 shadow transition hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800"
                >
                  <Icon name="ic:outline-delete-forever" class="h-4 w-4" />
                </button>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-gray-500 dark:text-gray-400">
        {{ $t("entertainment.no_reviews") }}
      </p>
    </div>
  </div>
</template>
