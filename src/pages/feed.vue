<script setup lang="ts">
const { t } = useI18n()
useHead({
  title: t("header.feed"),
  titleTemplate: "%s - Masterscore"
})
</script>

<template>
  <section class="mx-auto max-w-[842px] space-y-12 py-28">
    <FeedRecentJoined />
    <FeedRecentActivities />
  </section>
</template>
