<script setup>
const { t } = useI18n()
useHead({
  title: t("header.table"),
  titleTemplate: "%s - Masterscore"
})
</script>
<template>
  <div class="preffered-background">
    <HomeMasterscoreTable class="h-full py-24" />
  </div>
</template>
