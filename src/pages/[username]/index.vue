<script lang="ts" setup>
const route = useRoute()
const username = computed(() => route.params.username as string)
const data = await getUser(username.value)
</script>

<template>
  <div class="mt-24 px-4">
    <h2>coming soon</h2>
    <ClientOnly>
      <JsonViewer :value="data" copyable sort expanded theme="jsonviewer" />
    </ClientOnly>
  </div>
</template>
