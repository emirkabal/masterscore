<script lang="ts" setup>
import { useVModel } from "@vueuse/core"

const props = defineProps<{
  genres: { value: number; label: string }[]
  modelValue: number[]
}>()

const emit = defineEmits(["update:modelValue"])
const data = useVModel(props, "modelValue", emit)

const handleGenre = (genre: number) => {
  if (data.value.includes(genre)) {
    data.value.splice(data.value.indexOf(genre), 1)
  } else {
    data.value.push(genre)
  }
}
</script>

<template>
  <ScrollArea class="relative w-full whitespace-nowrap border-0 !outline-none">
    <div class="flex w-full max-w-0 gap-x-2 pb-4">
      <div
        v-for="genre in genres"
        class="cursor-pointer select-none rounded-full bg-popover px-4 py-2 font-medium text-gray-200"
        @click="handleGenre(genre.value)"
        :class="{
          '!bg-gray-800 text-white': data.includes(genre.value),
          'hover:bg-gray-900': !data.includes(genre.value)
        }"
      >
        {{ $t(`genres.${genre.label}`) }}
      </div>
    </div>
    <ScrollBar orientation="horizontal" />
  </ScrollArea>
</template>
