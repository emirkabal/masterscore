<script lang="ts" setup>
import { UseImage } from "@vueuse/components"
import { useEventBus, useScroll } from "@vueuse/core"

const bus = useEventBus<{
  scroll?: boolean
  new_message?: boolean
}>("theater-chat")

const chatBox = ref()
const scroller = ref()
const props = defineProps<{
  config: any
  connected: boolean
  chatHistory: any[]
  sendMsg: () => void
  startTyping: () => void
  modelValue: string
}>()
const emit = defineEmits(["update:modelValue"])

const scrollToBottom = () => {
  if (!chatBox.value) return
  nextTick(() => {
    chatBox.value.scrollTop = chatBox.value.scrollHeight
  })
}

bus.on((payload) => {
  if (payload.scroll) scrollToBottom()
  else if (payload.new_message && scroller.value.arrivedState.bottom) scrollToBottom()
})

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit("update:modelValue", value)
  }
})

watch(chatBox, () => {
  if (chatBox.value) {
    scroller.value = useScroll(chatBox)
  }
})
</script>

<template>
  <div class="relative">
    <div
      class="mr-1 max-h-[620px] overflow-y-scroll pr-1"
      ref="chatBox"
      :class="{
        'max-h-[calc(100vh-6.15rem)]': config.theaterMode
      }"
    >
      <div
        class="group flex items-start gap-x-4 px-6 py-2 hover:bg-gray-800"
        v-for="(msg, index) in chatHistory"
        :class="{
          '!py-0': chatHistory[index - 1]?.user?.id === msg.user.id,
          '!pb-0': chatHistory[index + 1]?.user?.id === msg.user.id
        }"
      >
        <div
          v-if="chatHistory[chatHistory.indexOf(msg) - 1]?.user?.id === msg.user.id"
          class="flex min-h-[25px] w-12 flex-shrink-0 items-center justify-center self-start text-xs text-gray-400 opacity-0 group-hover:opacity-100"
        >
          {{ $moment(msg.message.createdAt).locale($i18n.locale).format("HH:mm") }}
        </div>
        <NuxtLink v-else :to="msg.user?.isPublic ? `/users/@${msg.user.username}` : undefined">
          <Avatar
            v-if="msg.user.id !== 'system'"
            :username="msg?.user?.id"
            :avatar="msg?.user?.avatar"
            :verified="msg?.user?.verified"
            :minimize="true"
            class="h-12 w-12"
          />
          <img
            v-else
            src="~/assets/images/master.png"
            class="h-12 w-12 min-w-[48px] rounded-full"
          />
        </NuxtLink>
        <div class="flex w-[calc(100%-3rem)] flex-col">
          <div
            v-if="chatHistory[chatHistory.indexOf(msg) - 1]?.user?.id !== msg.user.id"
            class="flex items-center gap-x-2 break-all font-semibold tracking-tight text-white"
          >
            <span class="line-clamp-1">
              {{ msg?.user?.username || "Master" }}
            </span>
            <Icon
              v-if="msg.user?.host"
              v-tooltip="'Host'"
              class="inline-block h-5 w-5 flex-shrink-0 text-yellow-400"
              name="fa6-solid:masks-theater"
            />
            <IconsM
              v-if="msg.user.id === 'system'"
              v-tooltip="'System'"
              class="inline-block h-4 w-4 flex-shrink-0 text-yellow-400"
            />
            <span class="flex-shrink-0 text-xs text-gray-400">
              {{ $moment(msg?.message?.createdAt).locale($i18n.locale).calendar() }}
            </span>
          </div>
          <div v-if="msg?.message?.content?.startsWith('tenor:')">
            <UseImage
              :src="msg.message.content.replace('tenor:', '')"
              @vue:updated="scrollToBottom()"
              class="my-2 h-auto max-h-[200px] w-fit rounded-xl"
            >
              <template #loading>
                <span class="animte-pulse text-gray-400">
                  <Icon class="h-6 w-6 animate-spin" name="mdi:loading" />
                  Loading GIF...
                </span>
              </template>

              <template #error>
                <span class="text-red-400"> Failed to load GIF. Please try again later. </span>
              </template>
            </UseImage>
          </div>
          <div v-else class="break-words text-gray-300">
            {{ msg?.message?.content }}
          </div>
        </div>
      </div>
    </div>
    <Transition
      enter-active-class="transition ease-out duration-300 "
      enter-from-class="transform translate-y-full"
      enter-to-class="transform translate-y-0"
      leave-active-class="transition ease-in duration-300"
      leave-from-class="transform translate-y-0"
      leave-to-class="transform translate-y-full"
    >
      <button
        @click="scrollToBottom()"
        v-if="!scroller?.arrivedState?.bottom"
        class="absolute bottom-2 left-1/2 z-0 -translate-x-1/2 space-x-2 rounded-full bg-gray-800/80 px-4 py-1 text-sm font-semibold uppercase tracking-tight text-white/80 transition-all hover:bg-gray-700"
      >
        <Icon class="h-6 w-6 text-gray-400" name="material-symbols:keyboard-arrow-down-rounded" />
        <span>{{ $t("go-to-bottom") }}</span>
      </button>
    </Transition>
  </div>
  <div class="z-10 flex items-center !bg-gray-900 px-6 pb-4 pt-4">
    <UiInput
      type="text"
      class="w-full"
      variant="general"
      v-model="value"
      placeholder="Type your message here..."
      :disabled="!connected"
      @keyup.enter="sendMsg"
      @input="startTyping"
    />
    <button class="h-10 pl-4 text-sm font-bold uppercase text-white" @click="sendMsg">
      <Icon
        class="h-6 w-6 text-gray-400"
        :class="{
          '!text-blue-500': value.trim().length > 0
        }"
        name="ic:round-send"
      />
    </button>
  </div>
</template>
