<script lang="ts" setup>
import { Cropper } from "vue-advanced-cropper"
import "vue-advanced-cropper/dist/style.css"
import "vue-advanced-cropper/dist/theme.compact.css"
import { createReusableTemplate, useMediaQuery } from "@vueuse/core"
const isDesktop = useMediaQuery("(min-width: 768px)")

const props = defineProps<{
  type: "avatar" | "banner"
  show: boolean
  file?: File
}>()
const [DefineTemplate, ReuseTemplate] = createReusableTemplate()
const emits = defineEmits(["cropped", "cancel"])

const cropper = ref()
const preview = computed(() => props.file && URL.createObjectURL(props.file))

const save = async () => {
  const { canvas } = cropper.value.getResult()
  const base64 = canvas.toDataURL(props.file?.type)
  console.log(base64)
  emits("cropped", props.type, base64)
}
</script>

<template>
  <DefineTemplate>
    <Cropper
      ref="cropper"
      background-class="ms-cropper-background"
      foreground-class="ms-cropper-foreground"
      :src="preview"
      :transitions="false"
      :debounce="false"
      :stencil-props="{
        handlers: {},
        movable: false,
        scalable: false,
        resizable: false,
        aspectRatio: type === 'avatar' ? 1 : 2.5 / 1
      }"
      :canvas="{
        width: type === 'avatar' ? 512 : 1200,
        height: type === 'avatar' ? 512 : 600
      }"
      :resize-image="{
        adjustStencil: false
      }"
      :min-width="128"
      :min-height="128"
      image-restriction="stencil"
    />
  </DefineTemplate>
  <Modal v-if="isDesktop" title="Crop" :show="show" @close="$emit('cancel')">
    <template v-slot:body>
      <ReuseTemplate />
    </template>
    <template v-slot:footer>
      <Button variant="ghost" @click="$emit('cancel')"> İptal </Button>
      <Button @click="save"> Kaydet </Button>
    </template>
  </Modal>
  <Drawer v-else title="Crop" :show="show" @close="$emit('cancel')">
    <template v-slot:body>
      <ReuseTemplate />
    </template>
    <template v-slot:footer>
      <Button @click="save" class="w-full"> Kaydet </Button>
    </template>
  </Drawer>
</template>

<style>
.ms-cropper-background {
  @apply bg-gray-800;
}
.ms-cropper-foreground {
  @apply bg-gray-800;
}
</style>
