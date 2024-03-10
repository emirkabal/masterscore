<script lang="ts" setup>
import { useLocalStorage } from "@vueuse/core"

const preferences = useLocalStorage("preferences", {
  debug_mode: false,
  use_old_review_modal: false
})

const handleChange = (key: any, value: boolean) => {
  // @ts-ignore
  preferences.value[key] = value
}
</script>

<template>
  <section id="settings-preferences">
    <h3 class="mb-9 border-b border-gray-800 pb-4 text-2xl font-bold text-white lg:text-3xl">
      Preferences
    </h3>
    <div class="space-y-4">
      <FormField name="debug_mode">
        <FormItem
          class="flex flex-row items-center justify-between rounded-lg border border-border p-4"
        >
          <div class="space-y-0.5">
            <FormLabel class="text-base"> Debug Mode </FormLabel>
            <FormDescription> Show additional information for debugging purposes. </FormDescription>
          </div>
          <FormControl>
            <Switch
              :checked="preferences.debug_mode"
              @update:checked="(v) => handleChange('debug_mode', v)"
            />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField name="use_old_review_modal">
        <FormItem
          class="flex flex-row items-center justify-between rounded-lg border border-border p-4"
        >
          <div class="space-y-0.5">
            <FormLabel class="text-base"> Use Old Review Modal </FormLabel>
            <FormDescription>
              Use the old review modal instead of the new one. This will be removed in the future.
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              :checked="preferences.use_old_review_modal"
              @update:checked="(v) => handleChange('use_old_review_modal', v)"
            />
          </FormControl>
        </FormItem>
      </FormField>
    </div>
  </section>
</template>
