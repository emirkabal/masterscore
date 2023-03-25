<script setup>
const { data } = await useAsyncData("whoweare", () =>
  queryContent("/whoweare").findOne()
)
</script>

<template>
  <div class="container mx-auto my-24 px-4">
    <div class="flex items-center gap-4">
      <Logo class="text-2xl md:text-4xl" />
      <h1
        class="border-l-2 border-gray-700 px-4 text-2xl font-semibold md:text-4xl"
      >
        {{ data.title }}
      </h1>
    </div>
    <ContentRenderer
      :value="data"
      class="mt-2 space-y-5 text-xl leading-8 text-black/95 dark:text-white/95 md:text-2xl"
    />
  </div>
</template>
