<script setup>
const { data, pending } = useLazyFetch("/api/reviews/latest")
</script>

<template>
  <div>
    <h1
      class="mb-8 border-yellow-500 pl-2 text-2xl font-bold tracking-wide md:border-l-4"
    >
      Latest Reviews
    </h1>
    <div v-if="pending">
      <div
        class="flex animate-pulse items-center px-4 py-6"
        v-for="i in 8"
        :key="i"
      >
        <div
          class="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300 dark:bg-zinc-800 md:h-14 md:w-14"
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
    <div v-else class="flex flex-col gap-2">
      <div
        class="flex border-b px-4 py-6 dark:border-zinc-900"
        v-for="review in data"
        :key="review._id"
      >
        <div class="flex w-full items-center gap-4">
          <router-link
            :to="`/users/@${review.author.username}`"
            class="font-bold hover:underline"
            ><Avatar
              :username="review.author.username"
              class="h-10 w-10 flex-shrink-0 md:h-14 md:w-14"
          /></router-link>
          <div class="flex w-full flex-col">
            <div class="flex items-center justify-between">
              <router-link
                :to="`/users/@${review.author.username}`"
                class="text-sm font-bold hover:underline md:text-base"
                >@{{ review.author.username }}</router-link
              >
              <span class="text-xs text-gray-500 dark:text-gray-300">
                {{ $moment(review.createdAt).fromNow() }}
              </span>
            </div>
            <router-link
              :to="`/details/${review.entertainment.type}/${review.entertainment.id}`"
              class="group -mt-1 flex w-fit items-center gap-1 text-xs"
            >
              <div class="flex text-sm md:text-base">
                <span class="hidden md:block"> Reviewed: </span>
                <span
                  class="lineclamp-1 max-w-[136px] truncate break-words font-bold group-hover:underline md:ml-1 md:max-w-none"
                  >{{ review.entertainment.info.title }}</span
                >
              </div>
              <div class="flex items-center">
                <IconsStarFilled class="h-4 w-4 text-yellow-400" />
                <span class="text-sm font-semibold">{{ review.rating }}</span>
              </div>
            </router-link>
            <p
              v-if="review.content"
              class="whitespace-normal break-all text-base leading-4"
            >
              {{ review.content }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
