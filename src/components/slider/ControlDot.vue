<script setup lang="ts">
const props = defineProps<{
  color?: string
  active?: boolean
  value: number
}>()

const circle = ref<SVGCircleElement | null>(null)

const updateValues = () => {
  if (!circle.value) return

  const radius = circle.value.r.baseVal.value
  const circumference = radius * 2 * Math.PI

  circle.value.style.strokeDasharray = `${circumference} ${circumference}`
  circle.value.style.strokeDashoffset = `${circumference}`

  const offset = circumference - (props.value / 100) * circumference
  circle.value.style.strokeDashoffset = offset.toString()
}

onMounted(updateValues)
watch(() => props.value, updateValues)
</script>
<template>
  <div :style="{ '--progress-color': props.color }">
    <slot />
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="progress-dot pointer-events-auto cursor-pointer"
      viewBox="0 0 26 26"
    >
      <circle class="progress-dot-inner" :class="{ active }" cx="13" cy="13" r="3"></circle>
      <circle
        class="progress-dot-outer-overlay"
        ref="circle"
        cx="13"
        cy="13"
        r="12"
        fill="none"
        stroke-width="2"
      ></circle>
    </svg>
  </div>
</template>

<style scoped>
.progress-dot {
  width: 26px;
  height: 26px;
  transform: rotate(-90deg);
}

.progress-dot-inner {
  fill: var(--progress-color, #fff);
  opacity: 0.7;
  transition: opacity 0.2s ease-in-out;
}

.progress-dot-outer-overlay {
  stroke: var(--progress-color, #fff);
}

svg:hover .progress-dot-inner {
  opacity: 1;
}

.active {
  opacity: 1;
}
</style>
