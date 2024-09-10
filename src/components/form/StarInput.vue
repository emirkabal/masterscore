<script setup lang="ts">
const props = defineProps(["rating"])
const emit = defineEmits(["update:rating"])
const rating = computed({
  get() {
    return props.rating
  },
  set(value) {
    emit("update:rating", value)
  }
})

const input = (val: number) => {
  if (isNaN(val) || val < 0.5) {
    rating.value = 0.5
  } else if (val > 10) rating.value = 10
  else rating.value = Math.round(rating.value * 10) / 10
}

watch(rating, () => {
  if (isNaN(rating.value) || rating.value < 0.5) {
    rating.value = 0.5
  } else if (rating.value > 10) rating.value = 10
  else rating.value = Math.round(rating.value * 10) / 10
})

const increment = () => {
  rating.value += 0.1
}

const decrement = () => {
  rating.value -= 0.1
}
</script>
<template>
  <div class="flex w-fit items-center rounded border border-gray-800 bg-gray-900">
    <Icon name="material-symbols:star-rate-rounded" class="ml-2 h-4 w-4" />
    <input
      type="text"
      class="mx-2 w-7 border-0 bg-transparent p-0 text-center font-semibold focus:outline-none focus:ring-0"
      v-model="rating"
    />
    <div class="flex flex-col items-center justify-center">
      <button
        @click="increment"
        class="flex items-center self-center rounded px-2 py-1 hover:bg-gray-800"
      >
        <Icon name="material-symbols:keyboard-arrow-up-rounded" class="h-4 w-4" />
      </button>
      <button
        @click="decrement"
        class="flex items-center self-center rounded px-2 py-1 hover:bg-gray-800"
      >
        <Icon name="material-symbols:keyboard-arrow-down-rounded" class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>
