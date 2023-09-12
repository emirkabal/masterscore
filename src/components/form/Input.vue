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
    <input
      v-model="value"
      :type="type"
      placeholder=" "
      class="border-1 peer block w-full appearance-none rounded-lg border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
    />
    <label
      for="floating_outlined"
      class="pointer-events-none absolute left-1 top-2 z-10 origin-[0] -translate-y-5 scale-75 transform bg-white px-2 text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600"
      >{{ title }}</label
    >
  </div>
</template>
