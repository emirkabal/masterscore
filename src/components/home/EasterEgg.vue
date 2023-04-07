<script setup>
import { useLocalStorage } from '@vueuse/core';

const award = useLocalStorage('easteregg', 0);
</script>

<template>
  <div v-if="award >= 20" class="w-full text-center max-w-xs">
    <IconsAward class="w-20 h-auto mx-auto text-yellow-500" />
    <p class="font-maven font-semibold">Congratulations! <br />
      You won the <NuxtLink to="/details/movie/408425" class="hover:underline">"Best User"</NuxtLink> award!
    </p>
  </div>
</template>