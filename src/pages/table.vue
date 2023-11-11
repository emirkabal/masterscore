<script setup>
useHead({
  title: "Table",
  titleTemplate: "%s - Masterscore"
})
</script>
<template>
  <div>
    <div class="my-36 flex items-center justify-center">
      <FormStarInput />
    </div>
    <HomeMasterscoreTable class="my-24" />
  </div>
</template>
