<script setup lang="ts">
const scrollRef = ref<HTMLElement | null>(null)
const scroll = ref(0)
const maxScroll = ref(0)

watch(scrollRef, () => {
  if (scrollRef.value === null) return
  scroll.value = scrollRef.value.scrollLeft
  maxScroll.value = scrollRef.value?.scrollWidth - scrollRef.value?.clientWidth
})
</script>
<template>
  <div class="relative">
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
        class="absolute -right-32 -top-8 z-10 m-auto h-[400px] w-[160px] rounded bg-white blur-md dark:bg-black"
      ></div>
    </Transition>
    <div
      class="relative flex w-full gap-2.5 overflow-x-auto pb-4 scrollbar overflow-y-hidden scrollbar-thumb-gray-300 scrollbar-track-rounded-full scrollbar-thumb-rounded-full scrollbar-w-0 scrollbar-h-0 hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-zinc-900 dark:hover:scrollbar-thumb-zinc-800 md:scrollbar md:scrollbar-w-2.5 md:scrollbar-h-2.5"
      @scroll="scroll = ($event.target as HTMLElement).scrollLeft"
      ref="scrollRef"
    >
      <slot></slot>
    </div>
  </div>
</template>
