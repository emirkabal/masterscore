<script setup lang="ts">
import { useUserStore } from "~/store/user"
import { useFileDialog } from "@vueuse/core"

const config = useRuntimeConfig()

const userStore = useUserStore()

const props = defineProps<{
  settings: any
}>()

const banner = computed(() => {
  return props.settings.account.banner
    ? props.settings.account.banner.startsWith("http")
      ? props.settings.account.banner
      : props.settings.account.banner.length > 250
        ? props.settings.account.banner
        : `${config.public.SUPABASE_STORAGE_URL}banners/${props.settings.account.banner}`
    : null
})

const image = reactive({
  type: "avatar" as "avatar" | "banner",
  avatar: {
    show: false,
    file: null as any
  },
  banner: {
    show: false,
    file: null as any
  }
})

const avatarInput = useFileDialog({
  accept: "image/png, image/jpeg, image/webp, image/gif",
  multiple: false
})

const bannerInput = useFileDialog({
  accept: "image/png, image/jpeg, image/webp, image/gif",
  multiple: false
})

avatarInput.onChange((files) => {
  if (files?.length) {
    image.type = "avatar"
    image.avatar.file = files[0]
    image.avatar.show = true
  }
})

bannerInput.onChange((files) => {
  if (files?.length) {
    image.type = "banner"
    image.banner.file = files[0]
    image.banner.show = true
  }
})

const cancelCropping = () => {
  image[image.type].show = false
  image[image.type].file = null
}

const cropped = (type: "avatar" | "banner", v: string) => {
  image[type].show = false
  props.settings.account[type] = v
}
</script>

<template>
  <section id="settings-profile">
    <PagesSettingsImageCropper
      v-if="image[image.type].file"
      :type="image.type"
      :file="image[image.type].file"
      :show="image[image.type].show"
      @cancel="cancelCropping"
      @cropped="cropped"
    />
    <h3 class="mb-9 border-b border-gray-800 pb-4 text-2xl font-bold text-white lg:text-3xl">
      {{ $t("settings.profile") }}
    </h3>
    <div class="w-full space-y-6 rounded-xl border border-gray-800 bg-gray-900/40 p-4 md:p-12">
      <div>
        <span class="mb-2 block text-lg font-semibold tracking-tight text-white">
          {{ $t("settings.props.avatar") }}
        </span>
        <div class="flex justify-between gap-x-4">
          <div class="flex gap-x-2">
            <Button @click="avatarInput.open"> {{ $t("settings.change") }} </Button>
            <Button
              v-if="settings.account.avatar"
              variant="ghost"
              @click="settings.account.avatar = ''"
            >
              {{ $t("delete") }}
            </Button>
          </div>
          <Avatar
            :username="settings.account.username"
            :avatar="settings.account.avatar"
            class="h-14 w-14"
          />
        </div>
      </div>
      <div>
        <span class="mb-2 block text-lg font-semibold tracking-tight text-white">
          {{ $t("settings.props.banner") }}
        </span>
        <div class="flex justify-between gap-x-4">
          <div class="flex gap-x-2">
            <Button @click="bannerInput.open"> {{ $t("settings.change") }} </Button>
            <Button
              v-if="settings.account.banner"
              variant="ghost"
              @click="settings.account.banner = ''"
            >
              {{ $t("delete") }}
            </Button>
          </div>
          <img
            v-if="banner"
            :src="banner"
            :draggable="false"
            class="h-14 w-24 rounded-lg border border-border bg-gray-900 object-cover"
          />
          <div
            v-else
            class="flex h-14 w-24 items-center justify-center rounded-lg border border-border bg-gray-900"
          ></div>
        </div>
      </div>
      <div>
        <span class="mb-2 block text-lg font-semibold tracking-tight text-white">
          {{ $t("settings.about") }}
        </span>
        <Textarea
          class="h-10 w-full"
          v-model="settings.account.about"
          placeholder="i want to be happy"
        />
      </div>
    </div>
  </section>
</template>
