<script setup>
const scrollRef = ref(null)
const scroll = ref(0)
const maxScroll = ref(0)

const props = defineProps({
  type: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  }
})

const { data, pending } = useLazyFetch(
  `/api/extra/credits/${props.id}?type=${props.type}`
)
watch(scrollRef, () => {
  if (scrollRef.value === null) return
  maxScroll.value = scrollRef.value.scrollWidth - scrollRef.value.clientWidth
})
</script>
<template>
  <div class="relative flex basis-1/2 flex-col overflow-hidden">
    <h1
      class="my-4 border-l-4 border-blue-700 pl-4 text-2xl font-bold tracking-wide"
    >
      Cast
    </h1>
    <Transition
      enter-active-class="duration-150 ease-out"
      enter-from-class="transform opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="transform opacity-0"
    >
      <div
        v-show="scroll === 0 && maxScroll > 0"
        class="absolute -right-28 -top-0 z-10 m-auto h-[500px] w-[160px] rounded bg-white blur-md dark:bg-black"
      ></div>
    </Transition>
    <div v-if="pending" class="flex animate-pulse gap-2 overflow-x-hidden">
      <div class="flex flex-col" v-for="i in 8" :key="i">
        <div class="h-52 w-32 rounded bg-gray-300 dark:bg-zinc-800"></div>
        <div class="mt-2 h-2 w-32 rounded bg-gray-300 dark:bg-zinc-800"></div>
        <div class="mt-2 h-2 w-32 rounded bg-gray-300 dark:bg-zinc-800"></div>
      </div>
    </div>
    <div
      class="relative flex w-full snap-x snap-mandatory gap-2.5 overflow-x-auto pb-4 scrollbar overflow-y-hidden scrollbar-thumb-gray-300 scrollbar-track-rounded-full scrollbar-thumb-rounded-full scrollbar-w-1.5 scrollbar-h-1.5 dark:scrollbar-thumb-zinc-900"
      @scroll="scroll = $event.target.scrollLeft"
      ref="scrollRef"
      v-else-if="data.cast && data.cast.length > 0"
    >
      <div
        class="flex w-full max-w-[160px] flex-shrink-0 snap-center flex-col"
        v-for="cast in data.cast"
        :key="cast.id"
      >
        <div class="flex w-full flex-col items-center justify-center rounded">
          <div
            v-if="cast.profile_path"
            :style="{
              backgroundImage: `url(https://image.tmdb.org/t/p/w500${cast.profile_path})`
            }"
            class="h-52 w-full flex-shrink-0 rounded bg-white bg-cover bg-top bg-no-repeat dark:bg-black"
          ></div>
          <div
            v-else
            class="flex h-52 w-full flex-shrink-0 items-center justify-center rounded bg-gray-800 bg-cover bg-top bg-no-repeat font-maven font-semibold !text-white"
          >
            No Image
          </div>
          <div
            class="mt-2 flex h-full max-h-20 w-full flex-col items-center justify-center py-2 text-center font-maven"
          >
            <h1 class="lineclamp-2 font-semibold">{{ cast.name }}</h1>
            <p class="">
              {{ cast.character }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-center text-gray-500 dark:text-gray-400">No cast found</p>
    </div>
  </div>
</template>
