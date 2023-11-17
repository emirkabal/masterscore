<script setup lang="ts">
import { onClickOutside } from "@vueuse/core"
const { $event } = useNuxtApp()

const props = defineProps<{
  modal: boolean
}>()

const emits = defineEmits(["close"])
const slotEl = ref(null)

onClickOutside(slotEl, () => {
  if (props.modal) {
    emits("close")
  }
})

watch(
  () => props.modal,
  () => {
    $event("modal:trailer", props.modal)
    document.body.style.overflow = props.modal ? "hidden" : "auto"
  }
)
</script>

<template>
  <Transition name="fade">
    <div
      v-if="modal"
      class="fixed inset-0 left-0 top-0 z-40 flex h-full w-full items-center justify-center bg-black/80 px-4"
    >
      <div class="relative flex h-1/2 w-full justify-center md:w-1/2" ref="slotEl">
        <slot />
        <button
          @click="emits('close')"
          class="absolute -top-10 right-0 mb-1 opacity-50 transition-opacity hover:opacity-100"
        >
          <Icon name="ic:round-close" class="h-8 w-8 text-white" />
        </button>
      </div>
    </div>
  </Transition>
</template>
