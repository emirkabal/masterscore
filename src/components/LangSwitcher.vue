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
        <div class="relative mr-2 h-6 w-9 overflow-hidden rounded">
          <Icon
            :name="`flag:${localeProperties.flag || localeProperties.code}-4x3`"
            class="absolute left-0 h-full w-full scale-[1.21]"
          />
        </div>
        {{ localeProperties.name }}
        <Icon name="ic:round-arrow-drop-down" class="h-6 w-auto rounded" />
      </HeadlessListboxButton>
      <HeadlessListboxOptions
        class="absolute -top-[308px] left-0 z-50 flex flex-col overflow-hidden rounded-lg bg-zinc-900"
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
          <div class="flex flex-shrink-0 items-center gap-2">
            <div class="relative h-5 w-9 overflow-hidden rounded">
              <Icon
                :name="`flag:${l.flag || l.code}-4x3`"
                class="absolute left-0 h-full w-full scale-[1.3]"
              />
            </div>
            <span>{{ l.name }}</span>
          </div>
        </HeadlessListboxOption>
      </HeadlessListboxOptions>
    </HeadlessListbox>
  </div>
</template>
