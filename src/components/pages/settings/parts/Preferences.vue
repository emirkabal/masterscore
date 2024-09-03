<script lang="ts" setup>
const preferences = usePreferences()
const handleChange = (key: any, value: boolean) => {
  // @ts-ignore
  preferences.value[key] = value
}
</script>

<template>
  <section id="settings-preferences">
    <h3 class="mb-9 border-b border-gray-800 pb-4 text-2xl font-bold text-white lg:text-3xl">
      {{ $t("settings.preferences") }}
    </h3>
    <div class="space-y-4">
      <FormField name="debug_mode">
        <FormItem
          class="flex flex-row items-center justify-between rounded-lg border border-border p-4"
        >
          <div class="space-y-0.5">
            <FormLabel class="text-base"> {{ $t("settings.debug_mode") }} </FormLabel>
            <FormDescription> {{ $t("settings.debug_mode_alt") }} </FormDescription>
          </div>
          <FormControl>
            <Switch
              :checked="preferences.debug_mode"
              @update:checked="(v: boolean) => handleChange('debug_mode', v)"
            />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField name="use_old_review_modal">
        <FormItem
          class="flex flex-row items-center justify-between rounded-lg border border-border p-4"
        >
          <div class="space-y-0.5">
            <FormLabel class="text-base"> {{ $t("settings.use_old_review_modal") }} </FormLabel>
            <FormDescription>
              {{ $t("settings.use_old_review_modal_alt") }}
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              :checked="preferences.use_old_review_modal"
              @update:checked="(v: boolean) => handleChange('use_old_review_modal', v)"
            />
          </FormControl>
        </FormItem>
      </FormField>
    </div>
  </section>
</template>
