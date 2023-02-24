<script setup>
const { data, pending } = useLazyFetch("/api/reviews/latest")
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold md:border-l-4 pl-2 mb-8 border-yellow-500">
      Latest Reviews
    </h1>
    <div v-if="!pending" class="flex flex-col gap-2">
      <div
        class="flex p-6 border-b dark:border-zinc-900"
        v-for="review in data"
        :key="review._id"
      >
        <div class="flex items-center gap-4 w-full">
          <router-link
            :to="`/users/@${review.author.username}`"
            class="font-bold hover:underline"
            ><Avatar
              :username="review.author.username"
              class="w-14 h-14 flex-shrink-0"
          /></router-link>
          <div class="flex flex-col w-full">
            <div class="flex items-center justify-between">
              <router-link
                :to="`/users/@${review.author.username}`"
                class="font-bold hover:underline"
                >@{{ review.author.username }}</router-link
              >
              <span class="text-xs text-gray-500 dark:text-gray-300">
                {{ $moment(review.createdAt).fromNow() }}
              </span>
            </div>
            <router-link
              :to="`/details/${review.entertainment.type}/${review.entertainment.id}`"
              class="text-xs gap-1 -mt-1 flex items-center group w-fit"
            >
              <div class="flex">
                Reviewed:
                <span class="font-bold ml-1 group-hover:underline">{{
                  review.entertainment.info.title
                }}</span>
              </div>
              <div class="flex items-center">
                <IconsStarFilled class="w-4 h-4 text-yellow-400" />
                <span class="text-sm font-semibold">{{ review.rating }}</span>
              </div>
            </router-link>
            <p
              v-if="review.content"
              class="text-base truncate break-all whitespace-normal"
            >
              {{ review.content }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
