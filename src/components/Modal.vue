<script setup>
import { onClickOutside, onKeyStroke } from "@vueuse/core"
const modal = ref(null)
const emits = defineEmits(["close"])
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  show: {
    type: Boolean,
    default: false,
    required: true
  }
})
onKeyStroke("Escape", () => {
  emits("close")
})
onClickOutside(modal, () => {
  emits("close")
})
watch(
  () => props.show,
  (val) => {
    if (val) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }
)
</script>
<template>
  <Transition name="fade">
    <div
      v-if="props.show"
      class="fixed left-0 top-0 z-50 m-auto flex h-screen w-full items-center justify-center bg-black/40 px-4 shadow-2xl backdrop-blur md:px-0"
    >
      <div
        ref="modal"
        class="w-full rounded-lg bg-white dark:bg-zinc-900 md:w-1/4 md:min-w-[460px]"
      >
        <div
          class="flex select-none items-center justify-between px-4 py-4 text-xl font-semibold shadow dark:shadow-lg"
        >
          <span>{{ props.title }}</span>
          <span
            @click="$emit('close')"
            class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-red-600/10 text-red-500 hover:bg-red-600/20 hover:text-red-600 md:h-6 md:w-6"
            ><IconsTimes class="h-4 w-4 md:h-3 md:w-3"
          /></span>
        </div>
        <div class="p-4">
          <slot name="body"></slot>
        </div>
        <div
          class="flex justify-end space-x-2 border-t p-2 dark:border-zinc-800"
        >
          <!-- <button
            class="bg-red-600 hover:bg-red-700 transition-colors px-4 py-2 text-white font-semibold rounded"
            @click="$emit('close')"
          >
            Close
          </button> -->
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Transition>
</template>
