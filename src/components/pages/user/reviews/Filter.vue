<script lang="ts" setup>
defineProps<{
  data: {
    sort: string
    hasContent: boolean
  }
}>()
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="outline">
        <Icon name="mdi:filter" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-80">
      <div class="grid gap-4">
        <div class="grid grid-cols-3 items-center gap-4">
          <Label for="sort">Sort</Label>
          <Select id="sort" v-model="data.sort">
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="Select to sort" />
            </SelectTrigger>
            <SelectContent class="z-[999] w-[180px]">
              <SelectGroup>
                <SelectItem value="created_at-asc">Date (asc)</SelectItem>
                <SelectItem value="created_at-desc">Date (desc)</SelectItem>
                <SelectItem value="rating-asc">Rating (asc)</SelectItem>
                <SelectItem value="rating-desc">Rating (desc)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div class="flex items-center gap-4">
          <Label for="show_has_content"> Show only reviews with content </Label>
          <Switch id="show_has_content" class="ml-2.5" v-model:checked="data.hasContent" />
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>
