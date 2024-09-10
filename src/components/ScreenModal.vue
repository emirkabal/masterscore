<script setup lang="ts">
import { onClickOutside, onKeyPressed } from "@vueuse/core"

defineProps<{
  modal: boolean
}>()

const emits = defineEmits(["close"])
const slotEl = ref(null)

onKeyPressed("Escape", () => {
  emits("close")
})
onClickOutside(slotEl, () => {
  emits("close")
})
</script>

<template>
  <Transition name="fade">
    <div
      v-if="modal"
      class="modal fixed inset-0 left-0 top-0 z-40 flex h-full w-full items-center justify-center bg-black/80 px-4"
    >
      <div class="relative flex h-auto w-full justify-center lg:h-1/2 lg:w-max" ref="slotEl">
        <slot />
        <button
          @click="emits('close')"
          class="absolute -top-10 right-0 mb-1 opacity-50 transition-opacity hover:opacity-100"
        >
          <Icon name="material-symbols:close-rounded" class="h-8 w-8 text-white" />
        </button>
      </div>
    </div>
  </Transition>
</template>
