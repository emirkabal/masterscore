<script setup>
defineProps(["light"])
const { locale, locales, localeProperties, setLocale } = useI18n()
const availableLocales = computed(() => {
  return locales.value.filter((i) => i.code !== locale.value)
})
</script>
<template>
  <ClientOnly>
    <div
      class="relative select-none rounded px-4 py-2"
      :class="{
        'border border-gray-800 bg-gray-900': !light
      }"
    >
      <HeadlessListbox>
        <HeadlessListboxButton class="flex items-center text-sm font-semibold">
          <Icon
            :name="`circle-flags:${localeProperties.flag || localeProperties.code}`"
            class="mr-2 h-6 w-6"
          />
          {{ localeProperties.name }}
          <Icon name="ic:round-arrow-drop-down" class="h-6 w-auto rounded" />
        </HeadlessListboxButton>
        <HeadlessListboxOptions
          class="absolute -left-3 -top-[330px] z-50 flex max-h-80 flex-col overflow-hidden overflow-y-scroll rounded-lg border border-gray-800 bg-gray-900 p-1"
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
            class="flex cursor-pointer items-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors hover:bg-gray-800 hover:text-gray-100"
            :class="{
              'bg-gray-100 text-gray-900 hover:!bg-gray-200 hover:text-gray-800': light
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
  </ClientOnly>
</template>
