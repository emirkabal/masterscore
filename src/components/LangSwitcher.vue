<script setup>
defineProps(["light"])
const { locale, locales, localeProperties, setLocale } = useI18n()
const availableLocales = computed(() => {
  return locales.value.filter((i) => i.code !== locale.value)
})
</script>
<template>
  <div class="relative">
    <HeadlessListbox>
      <HeadlessListboxButton class="flex items-center text-sm font-semibold">
        <Icon
          :name="`flag:${locale === 'en' ? 'gb' : locale}-4x3`"
          class="mr-2 h-6 w-auto rounded"
        />
        {{ localeProperties.name }}
        <Icon name="ic:round-arrow-drop-down" class="h-6 w-auto rounded" />
      </HeadlessListboxButton>
      <HeadlessListboxOptions
        class="absolute -top-24 left-0 flex flex-col overflow-hidden rounded-lg bg-zinc-900"
        :class="{
          '!bg-gray-100': light
        }"
      >
        <HeadlessListboxOption
          v-for="l in availableLocales"
          :key="l.code"
          :value="l.code"
          :disabled="locale === l.code"
          @click="setLocale(l.code)"
          class="flex cursor-pointer items-center px-4 py-2 text-sm font-semibold transition-colors hover:bg-zinc-800 hover:text-gray-100"
          :class="{
            'bg-gray-100 text-gray-900 hover:!bg-gray-200 hover:text-gray-800':
              light
          }"
        >
          <Icon
            :name="`flag:${l.code === 'en' ? 'gb' : l.code}-4x3`"
            class="mr-2 h-6 w-auto rounded"
          />
          {{ l.name }}
        </HeadlessListboxOption>
      </HeadlessListboxOptions>
    </HeadlessListbox>
  </div>
</template>
