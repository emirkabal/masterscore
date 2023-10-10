<script setup>
const props = defineProps(["modelValue", "type", "title", "reveal"])
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
    <p class="mb-1 font-semibold">
      {{ title }}
    </p>
    <div class="relative">
      <input
        v-model="value"
        :type="type === 'password' && revealed ? 'text' : type"
        v-bind="$attrs"
        class="border-1 block w-full rounded-lg border-gray-300 bg-transparent px-2.5 py-3 text-sm text-gray-900 placeholder:opacity-70 focus:border-yellow-500 focus:outline-none focus:ring-0"
      />
      <button
        v-if="reveal"
        @click="revealed = !revealed"
        type="button"
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
