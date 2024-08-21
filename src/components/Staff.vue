<script setup lang="ts">
const { isMobileOrTablet } = useDevice()
const verifiedArea = ref<HTMLElement | null>(null)
const modal = ref(false)

const showTooltip = (e: MouseEvent) => {
  if (!verifiedArea.value) return
  if (isMobileOrTablet) {
    modal.value = true
  }
}
</script>

<template>
  <button ref="verifiedArea" class="flex items-center">
    <Drawer :show="modal" @close="modal = false" title="Verified Account">
      <template v-slot:body>
        <div class="flex items-start gap-2 text-base font-normal">
          <Logo class="h-8 w-8 flex-shrink-0 text-brand" />
          <div class="flex flex-col items-start">
            <span class="text-left leading-5 opacity-75">
              <!-- staff -->
              Staff member of masterscore.org
            </span>
            <a href="#" class="text-blue-500">Learn more</a>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <button
          class="flex h-12 w-full select-none items-center justify-center rounded-full border border-white px-4 py-2 text-base font-semibold hover:opacity-75"
          @click="modal = false"
        >
          Got it
        </button>
      </template>
    </Drawer>
    <Logo
      :small="true"
      class="h-6 w-6 text-brand focus:outline-none"
      @click="showTooltip"
      v-tooltip="{
        content: `This user is <b>staff</b>.`,
        html: true,
        delay: 100
      }"
    />
  </button>
</template>
