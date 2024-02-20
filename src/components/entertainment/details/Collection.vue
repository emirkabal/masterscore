<script setup lang="ts">
const { data } = defineProps<{
  data?: {
    id: number
    name: string
    backdrop_path: string
    poster_path: string
  }
  loading?: boolean
}>()

const { data: collection, pending } = useLazyFetch(`/api/extra/collections/${data?.id}`)
</script>
<template>
  <section>
    <h1 class="my-4 ml-4 border-l-4 border-green-600 pl-4 text-2xl font-bold tracking-wide">
      {{ $t("entertainment.collection") }}
    </h1>
    <EntertainmentSlider
      :data="collection ? collection.parts : []"
      :item-size="'default'"
      :loading="pending"
      :offset="16"
    />
  </section>
</template>
