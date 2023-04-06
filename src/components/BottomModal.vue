<script setup lang="ts">
import { onClickOutside } from "@vueuse/core"
const modal = ref<HTMLElement | null>(null)
const inAnimation = ref(false)
const emits = defineEmits(["close"])
const props = defineProps<{
  title: string
  show: boolean
}>()

const lastTouchEvents = reactive({
  touchY: 0,
  maxTranslateY: 0,
  maximumTouchY: 0
})

const getCalculatedY = (e?: TouchEvent) => {
  if (!modal.value || !e || e.touches.length < 1)
    return {
      touchY: lastTouchEvents.touchY,
      maxTranslateY: lastTouchEvents.maxTranslateY,
      maximumTouchY: lastTouchEvents.maximumTouchY
    }
  const modalHeight = modal.value.offsetHeight
  const windowHeight = window.innerHeight
  const maxTranslateY = windowHeight - modalHeight
  const maximumTouchY = windowHeight - maxTranslateY - 80
  const touchY = e.touches[0].clientY - maxTranslateY - 20
  lastTouchEvents.touchY = touchY
  lastTouchEvents.maxTranslateY = maxTranslateY
  lastTouchEvents.maximumTouchY = maximumTouchY
  return {
    touchY,
    maxTranslateY,
    maximumTouchY
  }
}

const closeWithAnimation = () => {
  if (!modal.value) return
  const { maxTranslateY } = getCalculatedY()
  inAnimation.value = true
  modal.value.style.transform = `translateY(${maxTranslateY}px)`
  setTimeout(() => {
    emits("close")
  }, 200)
  setTimeout(() => {
    inAnimation.value = false
    if (modal.value) {
      modal.value.style.transform = `translateY(${0}px)`
    }
  }, 300)
}

const touchMove = (e: TouchEvent) => {
  if (e.cancelable) e.preventDefault()
  if (modal.value) {
    const { touchY, maximumTouchY } = getCalculatedY(e)
    if (touchY < 0) return
    modal.value.style.transform = `translateY(${touchY}px)`
    if (touchY > maximumTouchY) {
      closeWithAnimation()
    }
  }
}

const touchEnd = (e: TouchEvent) => {
  if (e.cancelable) e.preventDefault()
  if (modal.value) {
    const { touchY, maximumTouchY } = getCalculatedY(e)
    if (touchY > maximumTouchY) return
    inAnimation.value = true
    modal.value.style.transform = `translateY(${0}px)`
    setTimeout(() => {
      inAnimation.value = false
    }, 300)
  }
}

onClickOutside(modal, () => {
  closeWithAnimation()
})

watchEffect(() => {
  if (modal.value) {
    const modalHeight = modal.value.offsetHeight
    const windowHeight = window.innerHeight
    const maxTranslateY = windowHeight - modalHeight
    const maximumTouchY = windowHeight - maxTranslateY - 80
    lastTouchEvents.maxTranslateY = maxTranslateY
    lastTouchEvents.maximumTouchY = maximumTouchY
  }
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
      class="fixed left-0 top-0 z-50 m-auto flex h-screen w-full items-end justify-center bg-black/40 shadow-2xl backdrop-blur"
    >
      <div
        ref="modal"
        class="w-full bg-white px-2 dark:bg-black"
        :class="{
          'transition-transform': inAnimation
        }"
      >
        <button
          @touchmove="touchMove"
          @touchend="touchEnd"
          class="flex w-full cursor-default items-center justify-center pb-4 pt-2"
        >
          <span
            class="h-1.5 w-10 rounded-full bg-gray-300 dark:bg-zinc-800"
          ></span>
        </button>
        <div
          class="ml-0.5 flex items-center justify-between px-4 text-xl font-bold"
        >
          <span>{{ props.title }}</span>
        </div>
        <div class="px-4 py-4">
          <slot name="body"></slot>
        </div>
        <div class="flex w-full justify-center px-4 pb-4 dark:border-zinc-800">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Transition>
</template>
