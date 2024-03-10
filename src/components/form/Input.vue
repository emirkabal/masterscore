<script setup>
const props = defineProps(["modelValue", "type", "title", "reveal", "variant", "loading", "icon"])
const emit = defineEmits(["update:modelValue"])
const revealed = ref(false)

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit("update:modelValue", value)
  }
})
</script>
<template>
  <div>
    <p v-if="title" class="mb-1 font-semibold">
      {{ title }}
    </p>
    <div class="relative">
      <div
        v-if="icon"
        class="absolute bottom-0 left-1 top-0 my-auto flex h-8 w-8 items-center justify-center"
      >
        <Icon class="h-5 w-5 text-gray-400" :name="icon" />
      </div>
      <input
        v-model="value"
        :type="type === 'password' && revealed ? 'text' : type"
        v-bind="$attrs"
        class="border px-4 py-2"
        :class="{
          'w-full select-none resize-none rounded  border-gray-400 focus:ring-1 focus:ring-gray-700 disabled:opacity-75 dark:border-gray-700 dark:bg-gray-800':
            variant === 'general',
          'border-1 block w-full rounded-lg border-gray-300 bg-transparent px-2.5 py-3 text-sm text-gray-900 placeholder:opacity-70 focus:border-yellow-500 focus:outline-none focus:ring-0':
            variant !== 'general',
          'pl-9': icon
        }"
      />
      <div
        v-if="loading"
        class="absolute bottom-0 right-2.5 top-0 my-auto flex h-8 w-8 items-center justify-center"
      >
        <Icon class="h-5 w-5 animate-spin text-gray-400" name="mdi:loading" />
      </div>
      <button
        v-if="reveal"
        @click="revealed = !revealed"
        type="button"
        tabindex="-1"
        class="absolute bottom-0 right-2.5 top-0 my-auto flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-gray-50"
      >
        <Icon
          class="h-4 w-4 text-gray-900"
          :name="revealed ? 'mdi:eye-off-outline' : 'mdi:eye-outline'"
        />
      </button>
    </div>
  </div>
</template>
