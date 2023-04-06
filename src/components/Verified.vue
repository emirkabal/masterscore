<script setup lang="ts">
import { vOnClickOutside } from "@vueuse/components"
const { isMobileOrTablet } = useDevice()
const verifiedArea = ref<HTMLElement | null>(null)
const tooltipArea = ref<HTMLElement | null>(null)
const tooltip = ref(false)
const modal = ref(false)
const hideTooltip = () => {
  tooltip.value = false
}
const showTooltip = (e: MouseEvent) => {
  if (!verifiedArea.value || !tooltipArea.value) return
  if (!isMobileOrTablet) {
    const { top, left, width } = verifiedArea.value.getBoundingClientRect()
    tooltipArea.value.style.top = `${top - 123}px`
    tooltipArea.value.style.left = `${
      left - (tooltipArea.value.offsetWidth - width) / 2
    }px`
    tooltip.value = true
  } else {
    modal.value = true
  }
}
</script>

<template>
  <button ref="verifiedArea">
    <Transition name="fade">
      <div
        v-on-click-outside="hideTooltip"
        v-show="tooltip"
        ref="tooltipArea"
        class="absolute left-0 top-0 z-10 w-72 cursor-auto select-text rounded bg-gray-100 px-4 py-2 text-left shadow-xl dark:bg-zinc-950"
      >
        <span class="mb-1 flex items-center gap-1 font-semibold">
          <IconsVerified class="h-5 w-5 text-yellow-400 opacity-75" />
          Verified
        </span>
        <span class="flex flex-col gap-2 text-sm leading-5 opacity-75">
          This user is verified because the user was one of the first
          contributors.
        </span>
        <a href="#" class="text-blue-500">Learn more</a>
      </div>
    </Transition>
    <BottomModal :show="modal" @close="modal = false" title="Verified Account">
      <template v-slot:body>
        <div class="flex items-start gap-2">
          <IconsVerified class="h-8 w-8 flex-shrink-0 text-yellow-400" />
          <div class="flex flex-col items-start">
            <span class="text-left leading-5 opacity-75">
              This user is verified because the user was one of the first
              contributors.
            </span>
            <a href="#" class="text-blue-500">Learn more</a>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <button
          class="flex h-12 w-full select-none items-center justify-center rounded-full border border-black px-4 py-2 font-semibold hover:opacity-75 dark:border-white"
          @click="modal = false"
        >
          Got it
        </button>
      </template>
    </BottomModal>
    <IconsVerified class="h-7 w-7 text-yellow-400" @click="showTooltip" />
  </button>
</template>
