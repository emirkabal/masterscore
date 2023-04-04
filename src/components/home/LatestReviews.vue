<script setup>
const { data, pending } = useLazyFetch("/api/reviews/latest")
</script>

<template>
  <div class="min-w-0">
    <h1
      class="mb-8 border-yellow-500 pl-2 text-2xl font-bold tracking-wide md:border-l-4"
    >
      Latest Reviews
    </h1>
    <div
      class="my-4 flex items-center justify-between rounded bg-yellow-600/10 p-2 text-yellow-500"
    >
      <span class="flex flex-col items-center gap-2.5 sm:flex-row">
        <IconsAlert class="h-6 w-6" />
        <span>
          <NuxtLink to="/feed" class="hover:underline">
            <span class="font-semibold">Deprecated!</span> There is gonna be
            removed in the future updates; please use the new feed instead.
          </NuxtLink></span
        >
      </span>
    </div>
    <div v-if="pending">
      <div class="flex items-center px-4 py-6" v-for="i in 8" :key="i">
        <div
          class="skeleton-effect h-10 w-10 flex-shrink-0 rounded-full bg-gray-300 dark:bg-zinc-800 md:h-14 md:w-14"
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
    <div v-else class="flex flex-col gap-2">
      <div
        class="flex border-b px-4 py-6 dark:border-zinc-900"
        v-for="review in data"
        :key="review._id"
      >
        <div class="flex w-full items-start gap-4">
          <NuxtLink
            :to="`/users/@${review.author.username}`"
            class="font-bold hover:underline"
            ><Avatar
              :username="review.author.username"
              :avatar="review.author.avatar"
              class="h-10 w-10 flex-shrink-0 md:h-14 md:w-14"
          /></NuxtLink>
          <div class="flex w-full min-w-0 flex-col">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <NuxtLink
                  :to="`/users/@${review.author.username}`"
                  class="text-sm font-bold hover:underline md:text-base"
                  >@{{ review.author.username }}</NuxtLink
                >
                <span
                  class="hidden text-xs text-gray-500 dark:text-gray-300 sm:block"
                >
                  {{ $moment(review.createdAt).fromNow() }}
                </span>
              </div>

              <div class="flex items-center gap-1">
                <span class="text-sm font-semibold">{{ review.rating }}</span>
                <IconsStarFilled class="h-4 w-4 text-yellow-400" />
              </div>
            </div>
            <NuxtLink
              :to="`/details/${review.entertainment.type}/${review.entertainment.id}`"
              class="group -mt-1 flex w-fit items-center gap-1 text-xs"
            >
              <div class="flex text-sm leading-5 md:text-base">
                <span> Reviewed: </span>
                <span
                  class="ml-1 break-all font-bold line-clamp-1 group-hover:underline"
                  >{{ review.entertainment.info.title }}</span
                >
              </div>
            </NuxtLink>
            <ReviewContent
              v-if="review.content && review.content.length > 0"
              :review="review"
            />
            <span
              class="block text-xs text-gray-500 dark:text-gray-300 sm:hidden"
            >
              {{ $moment(review.createdAt).fromNow() }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
