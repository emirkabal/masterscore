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
      class="bg-black-500/10 fixed inset-0 left-0 top-0 z-50 m-auto flex h-full min-h-0 w-full items-center justify-center shadow-2xl backdrop-blur md:px-0 lg:px-4 lg:py-8"
    >
      <div
        ref="modal"
        class="relative h-full w-full overflow-hidden overflow-y-auto rounded-2xl scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-rounded-2xl scrollbar-thumb-rounded-full dark:bg-gray-900 md:min-w-[460px] lg:h-auto lg:max-h-full lg:max-w-[512px]"
      >
        <div
          class="flex select-none items-center justify-between px-4 pb-2 pt-4 text-xl font-semibold"
        >
          <span>{{ props.title }}</span>
          <button @click="$emit('close')">
            <Icon
              name="ic:round-close"
              class="h-6 w-6 text-gray-600 transition-colors hover:text-gray-200 md:h-8 md:w-8"
            />
          </button>
        </div>
        <div class="p-4">
          <slot name="body"></slot>
        </div>
        <div
          class="absolute bottom-0 left-0 flex w-full justify-end space-x-2 bg-gray-950 p-6 lg:relative"
        >
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Transition>
</template>
