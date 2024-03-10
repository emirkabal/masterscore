<script setup lang="ts">
import { getCollection } from "~/composables/request"

const { data } = defineProps<{
  data?: {
    id: number
    name: string
    backdrop_path: string
    poster_path: string
  }
  loading?: boolean
}>()

const c = await getCollection(data?.id as number)
</script>
<template>
  <section>
    <h1 class="my-4 ml-4 border-l-4 border-green-600 pl-4 text-2xl font-bold tracking-wide">
      {{ $t("entertainment.collection") }}
    </h1>
    <EntertainmentSlider :data="c ? c.parts : []" :item-size="'default'" :offset="16" />
  </section>
</template>
