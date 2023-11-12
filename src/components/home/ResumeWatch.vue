<script setup lang="ts">
import type { HistoryItem } from "~/types"
import { useLocalStorage } from "@vueuse/core"

const history = useLocalStorage<HistoryItem[]>("player-history", [])
const list = computed(() =>
  history.value.sort((a, b) => b.playedAt - a.playedAt)
)
const remove = (index: number) => history.value.splice(index, 1)
const watchModal = ref(false)
const data = shallowRef<HistoryItem>()
</script>
<template>
  <section class="px-[4vw]">
    <EntertainmentWatch
      v-if="data"
      :watchModal="watchModal"
      @close="() => (watchModal = false)"
      :data="data"
    />
    <div class="mb-4 flex items-center gap-x-2">
      <h1 class="text-2xl font-bold tracking-tight">Resume Watching</h1>
      <span
        class="flex h-6 items-center rounded-full bg-yellow-400 px-2 text-xs font-black uppercase tracking-tight text-black"
      >
        BETA
      </span>
    </div>

    <div v-if="history.length" class="flex gap-2 overflow-x-auto pb-6">
      <div
        v-for="(item, index) in list"
        :key="index"
        @click="
          () => {
            data = item
            watchModal = true
          }
        "
        class="relative max-w-lg cursor-pointer overflow-hidden rounded-xl bg-gray-900"
      >
        <div class="absolute right-0 top-0 m-2">
          <button
            @click="
              (e) => {
                e.stopPropagation()
                remove(index)
              }
            "
            class="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 transition-colors hover:bg-black/60"
          >
            <Icon name="ic:round-close" class="text-white" />
          </button>
        </div>

        <div class="absolute bottom-0 w-full bg-black/40 px-4 py-2">
          <div class="flex justify-between">
            <div
              class="flex items-center gap-x-4 font-semibold tracking-tight text-white"
            >
              <h1 class="text-2xl font-semibold tracking-tight">
                {{ item.title }}
              </h1>
              <span
                v-if="item.series"
                class="mt-1 text-sm font-semibold tracking-tight text-gray-400"
              >
                S{{ item.series.season }} E{{ item.series.episode }}
              </span>
            </div>
            <span class="text-2xl font-black text-yellow-500">m</span>
          </div>
        </div>
        <MasterImage :source="item.backdrop" class="w-full" />
      </div>
    </div>
  </section>
</template>
