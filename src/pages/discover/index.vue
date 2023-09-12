<script setup>
const { t } = useI18n()
const getRandomColor = () => {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-purple-500"
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

useHead({
  title: t("discover.title"),
  titleTemplate: "%s - Masterscore"
})
</script>

<template>
  <section class="my-24 px-[4vw]">
    <div
      class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
    >
      <NuxtLink
        :to="`/discover/${genre.support[0]}/${genre.id}`"
        v-for="genre in $tgenres"
        class="flex min-h-[300px] items-center justify-center rounded-xl p-12 text-center text-4xl font-bold transition-opacity hover:opacity-75"
        :class="getRandomColor()"
      >
        {{ $t("genres." + genre.name) }}
      </NuxtLink>
    </div>
  </section>
</template>
