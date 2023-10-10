<script setup>
const props = defineProps(["modelValue", "type", "title"])
const emit = defineEmits(["update:modelValue"])

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
  <div class="relative">
    <p class="mb-1 font-semibold">
      {{ title }}
    </p>
    <input
      v-model="value"
      :type="type"
      v-bind="$attrs"
      class="border-1 block w-full rounded-lg border-gray-300 bg-transparent px-2.5 py-3 text-sm text-gray-900 placeholder:opacity-50 focus:border-yellow-500 focus:outline-none focus:ring-0"
    />
  </div>
</template>
