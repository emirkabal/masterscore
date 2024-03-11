<script lang="ts" setup>
import { useMediaQuery } from "@vueuse/core"
import VuePictureCropper, { cropper } from "vue-picture-cropper"
const isDesktop = useMediaQuery("(min-width: 768px)")

const props = defineProps<{
  type: "avatar" | "banner"
  show: boolean
  file?: File
}>()

const emits = defineEmits(["cropped", "cancel"])

const getBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () =>
      resolve(
        reader.result?.toString().replace("application/octet-stream", props?.file?.type as string)
      )
    reader.onerror = (error) => reject(error)
  })
}

const preview = computed(() => props.file && URL.createObjectURL(props.file))
const save = async () => {
  const cropped = await cropper?.getFile()
  if (!cropped) return
  const base64 = await getBase64(cropped)
  emits("cropped", props.type, base64)
}
</script>

<template>
  <Modal v-if="isDesktop" title="Crop" :show="show" @close="$emit('cancel')">
    <template v-slot:body>
      <VuePictureCropper
        :boxStyle="{
          width: '100%',
          height: '100%',
          maxHeight: 'calc(100vh - 200px)',
          backgroundColor: '#000'
        }"
        :img="preview"
        :options="{
          viewMode: 2,
          dragMode: 'move',
          aspectRatio: type === 'avatar' ? 1 : 3
        }"
        :preset-mode="{
          mode: 'fixedSize',
          width: type === 'avatar' ? 512 : 1024,
          height: type === 'avatar' ? 512 : 256
        }"
      />
    </template>
    <template v-slot:footer>
      <Button variant="ghost" @click="$emit('cancel')"> İptal </Button>
      <Button @click="save"> Kaydet </Button>
    </template>
  </Modal>
  <Drawer v-else title="Crop" :show="show" @close="$emit('cancel')">
    <template v-slot:body>
      <VuePictureCropper
        :boxStyle="{
          width: '100%',
          height: '100%',
          maxHeight: 'calc(100vh - 200px)',
          backgroundColor: '#000'
        }"
        :img="preview"
        :options="{
          viewMode: 2,
          dragMode: 'move',
          aspectRatio: type === 'avatar' ? 1 : 3
        }"
        :preset-mode="{
          mode: 'fixedSize',
          width: type === 'avatar' ? 512 : 1024,
          height: type === 'avatar' ? 512 : 256
        }"
      />
    </template>
    <template v-slot:footer>
      <Button @click="save" class="w-full"> Kaydet </Button>
    </template>
  </Drawer>
</template>
