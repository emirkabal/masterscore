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
      class="skeleton-effect relative h-full min-h-[900px] w-full bg-gray-100 dark:bg-zinc-900 lg:h-[780px] lg:min-h-[780px]"
    >
      <div
        v-if="feature"
        class="fixed bottom-0 right-0 z-10 m-2 shadow-2xl lg:absolute lg:m-4"
      >
        <HomeRandomMovie :collapsed="true" />
      </div>
      <div class="h-full w-full">
        <div
          class="container m-auto flex h-full min-h-[900px] w-full items-center justify-center px-4 pt-14 lg:min-h-0 lg:justify-start lg:pt-0"
        >
          <div
            class="flex h-full w-full flex-col items-center justify-center gap-8 py-8 drop-shadow-2xl lg:flex-row lg:justify-start lg:gap-16 lg:py-0"
          >
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    v-else-if="colors"
    class="relative h-full min-h-[900px] w-full bg-cover bg-center bg-no-repeat lg:h-[780px] lg:min-h-[780px]"
    :style="{
      'background-image': props.backgroundURL
        ? `url(${props.backgroundURL})`
        : 'none'
    }"
  >
    <div
      v-if="feature"
      class="fixed bottom-0 right-0 z-10 m-2 shadow-2xl lg:absolute lg:m-4"
    >
      <HomeRandomMovie :collapsed="true" />
    </div>
    <div
      class="h-full w-full"
      :style="{
        background: `linear-gradient(135deg, rgba(${colors.background[0]}, ${colors.background[1]}, ${colors.background[2]}, 1) 0%, rgba(${colors.gradient[0]}, ${colors.gradient[1]}, ${colors.gradient[2]}, .75) 100%)`
      }"
    >
      <div
        class="container m-auto flex h-full min-h-[900px] w-full items-center justify-center px-4 pt-14 lg:min-h-0 lg:justify-start lg:pt-0"
      >
        <div
          class="flex h-full w-full flex-col items-center justify-center gap-8 py-8 drop-shadow-2xl lg:flex-row lg:justify-start lg:gap-16 lg:py-0"
        >
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
