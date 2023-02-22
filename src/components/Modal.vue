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
      class="fixed top-0 left-0 z-50 m-auto flex h-screen w-full items-center justify-center bg-black/40 backdrop-blur shadow-2xl"
    >
      <div
        ref="modal"
        class="w-1/4 min-w-[460px] rounded-lg bg-white dark:bg-zinc-900"
      >
        <div
          class="flex select-none items-center justify-between px-4 py-4 text-xl font-semibold shadow dark:shadow-lg"
        >
          <span>{{ props.title }}</span>
          <span
            @click="$emit('close')"
            class="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-600/10 pb-1 text-red-500 hover:bg-red-600/20 hover:text-red-600"
            >&times;</span
          >
        </div>
        <div class="p-4">
          <slot name="body"></slot>
        </div>
        <div
          class="flex justify-end space-x-2 p-2 border-t dark:border-zinc-800"
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
