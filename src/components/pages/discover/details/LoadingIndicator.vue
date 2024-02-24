<template>
  <div class="loading relative top-0 w-full">
    <div class="absolute -top-6 z-10 h-1 w-24 rounded-full bg-gray-400/40"></div>
  </div>
</template>

<style scoped>
.loading {
  animation: loading 800ms infinite;
}
@keyframes loading {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(105%);
  }
}
</style>
