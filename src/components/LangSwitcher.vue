<script setup>
defineProps(["light"])
const { locale, locales, localeProperties, setLocale } = useI18n()
const availableLocales = computed(() => {
  return locales.value.filter((i) => i.code !== locale.value)
})
</script>
<template>
  <div class="relative select-none">
    <HeadlessListbox>
      <HeadlessListboxButton class="flex items-center text-sm font-semibold">
        <Icon
          :name="`circle-flags:${
            localeProperties.flag || localeProperties.code
          }`"
          class="mr-2 h-6 w-6"
        />
        {{ localeProperties.name }}
        <Icon name="ic:round-arrow-drop-down" class="h-6 w-auto rounded" />
      </HeadlessListboxButton>
      <HeadlessListboxOptions
        class="absolute -top-[330px] left-0 z-50 flex flex-col overflow-hidden rounded-lg border border-zinc-800 bg-black"
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
          class="flex cursor-pointer items-center px-4 py-2 text-sm font-semibold transition-colors hover:bg-zinc-900 hover:text-gray-100"
          :class="{
            'bg-gray-100 text-gray-900 hover:!bg-gray-200 hover:text-gray-800':
              light
          }"
        >
          <div class="flex flex-shrink-0 items-center gap-2">
            <Icon :name="`circle-flags:${l.flag || l.code}`" class="h-6 w-6" />
            <span>{{ l.name }}</span>
          </div>
        </HeadlessListboxOption>
      </HeadlessListboxOptions>
    </HeadlessListbox>
  </div>
</template>
