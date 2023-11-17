<script setup>
import { useLocalStorage } from "@vueuse/core"

const award = useLocalStorage("easteregg", 0)
</script>

<template>
  <div v-if="award >= 20" class="w-full max-w-xs text-center">
    <IconsAward class="mx-auto h-auto w-20 text-yellow-500" />
    <p class="font-maven font-semibold">
      Congratulations! <br />
      You won the
      <NuxtLink to="/details/movie/408425" class="hover:underline">"Best User"</NuxtLink>
      award!
    </p>
  </div>
</template>
