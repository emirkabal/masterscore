<script setup lang="ts">
const props = defineProps<{
  colors?: {
    background: number[]
    gradient: number[]
  }
  backgroundURL?: string
  feature?: string
  loading?: boolean
}>()

const colors = computed(() => {
  return props.colors
})
</script>

<template>
  <div v-if="loading">
    <div
      class="skeleton-effect relative h-full min-h-[900px] w-full bg-gray-100 dark:bg-gray-900 lg:h-[90vh] lg:min-h-[780px]"
      :style="{
        background: `linear-gradient(
            rgba(15, 23, 42, 1) 0%,
            rgb(15, 23, 42, .85) 80%,
            rgb(3, 7, 18, 0) 100%
          )`
      }"
    >
      <div v-if="feature" class="fixed bottom-0 right-0 z-10 m-2 shadow-2xl lg:absolute lg:m-4">
        <HomeRandomMovie :collapsed="true" />
      </div>
      <div class="h-full w-full">
        <EntertainmentContainerInner>
          <slot />
        </EntertainmentContainerInner>
      </div>
    </div>
  </div>
  <div
    v-else-if="colors"
    class="relative h-full min-h-[900px] w-full bg-cover bg-center bg-no-repeat lg:h-[90vh] lg:min-h-[780px]"
    :style="{
      'background-image': props.backgroundURL ? `url(${props.backgroundURL})` : 'none'
    }"
  >
    <div v-if="feature" class="fixed bottom-0 right-0 z-10 m-2 shadow-2xl lg:absolute lg:m-4">
      <HomeRandomMovie :collapsed="true" />
    </div>
    <div
      class="h-full w-full"
      :style="{
        background: `linear-gradient(
            rgba(${colors.background[0]}, ${colors.background[1]}, ${colors.background[2]}, .75) 0%,
            rgb(3, 7, 18) 100%
          )`
      }"
    >
      <EntertainmentContainerInner>
        <slot />
      </EntertainmentContainerInner>
    </div>
  </div>
</template>
