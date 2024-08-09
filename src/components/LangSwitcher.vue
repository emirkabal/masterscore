<script setup>
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

const { locale, locales, setLocale } = useI18n()
</script>
<template>
  <Select :default-value="locale" @update:model-value="setLocale">
    <SelectTrigger class="w-[180px]">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem
          v-for="l in locales"
          :key="l.code"
          :value="l.code"
          :disabled="locale === l.code"
        >
          <div class="flex flex-shrink-0 items-center gap-2">
            <Icon :name="`circle-flags:${l.flag || l.code}`" class="h-6 w-6" />
            <span>{{ l.name }}</span>
          </div>
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
