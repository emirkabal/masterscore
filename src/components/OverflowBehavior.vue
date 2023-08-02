<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    buttonsActive?: boolean
  }>(),
  {
    buttonsActive: true
  }
)

const scrollRef = ref<HTMLElement | null>(null)
const scroll = ref(0)
const maxScroll = ref(0)
const actualHeight = ref(0)
const actualItemWidth = ref(0)

const next = () => {
  if (!scrollRef.value) return

  const skip =
    scroll.value +
    Math.floor(scrollRef.value.clientWidth / actualItemWidth.value) *
      actualItemWidth.value

  scrollRef.value.scroll({
    left: skip,
    behavior: "smooth"
  })
}

const prev = () => {
  if (!scrollRef.value) return

  const beforeScroll =
    scroll.value -
    Math.floor(scrollRef.value.clientWidth / actualItemWidth.value) *
      actualItemWidth.value

  scrollRef.value.scroll({
    left: beforeScroll,
    behavior: "smooth"
  })
}

const updateScroll = () => {
  if (!scrollRef.value) return
  // @ts-ignore
  if (
    scrollRef.value?.children.item(0)?.clientWidth !== actualItemWidth.value
  ) {
    actualItemWidth.value =
      // @ts-ignore
      scrollRef.value?.children.item(0)?.clientWidth + 4
  }
  scroll.value = scrollRef.value.scrollLeft
  actualHeight.value = scrollRef.value?.clientHeight + 32
  maxScroll.value = scrollRef.value?.scrollWidth - scrollRef.value?.clientWidth
}

watch(scrollRef, () => {
  if (!scrollRef.value) return
  updateScroll()
})
</script>
<template>
  <section class="group relative">
    <div v-if="props.buttonsActive" class="hidden md:block">
      <div
        v-show="scroll > 0"
        @click="prev"
        class="absolute left-0 top-0 z-20 flex h-full w-14 cursor-pointer items-center bg-none opacity-0 transition-all group-hover:opacity-100 hover:bg-gray-700/60 dark:hover:bg-black/60"
      >
        <IconsChevron class="m-auto h-10 w-10 text-white" />
      </div>
      <div
        v-show="scroll < maxScroll && maxScroll > 100"
        @click="next"
        class="absolute right-0 top-0 z-20 flex h-full w-14 cursor-pointer items-center bg-none opacity-0 transition-all group-hover:opacity-100 hover:bg-gray-700/60 dark:hover:bg-black/60"
      >
        <IconsChevron class="m-auto h-10 w-10 rotate-180 text-white" />
      </div>
    </div>
    <div class="relative">
      <div
        class="relative flex w-full gap-x-2.5 overflow-x-auto overflow-y-hidden scrollbar scrollbar-thumb-gray-300 scrollbar-track-rounded-full scrollbar-thumb-rounded-full scrollbar-w-0 scrollbar-h-0 hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-zinc-900 dark:hover:scrollbar-thumb-zinc-800 md:snap-x md:snap-mandatory md:scrollbar md:scrollbar-w-2.5 md:scrollbar-h-2.5"
        :class="{
          'scrollbar-none': props.buttonsActive
        }"
        @scroll="updateScroll"
        ref="scrollRef"
      >
        <slot></slot>
      </div>
    </div>
  </section>
</template>
