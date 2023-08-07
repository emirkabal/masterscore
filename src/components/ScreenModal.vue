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
  <div
    v-if="modal"
    class="fixed left-0 top-0 z-40 h-[100vh] w-full bg-black/80"
  >
    <div
      class="z-50 m-auto flex h-full max-w-[1920px] flex-col items-center justify-center p-2 sm:p-24 md:p-32 lg:p-40 2xl:p-96"
    >
      <button
        @click="emits('close')"
        class="mb-1 self-end opacity-50 transition-opacity hover:opacity-100"
      >
        <IconsTimes class="h-8 w-8 text-white" />
      </button>
      <div class="flex w-full justify-center" ref="slotEl">
        <slot />
      </div>
    </div>
  </div>
</template>
