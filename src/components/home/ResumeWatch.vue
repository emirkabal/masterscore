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
  <section class="px-[4vw]" v-if="history.length">
    <EntertainmentWatch
      v-if="data"
      :watchModal="watchModal"
      @close="() => (watchModal = false)"
      :data="data"
    />
    <div class="mb-4 flex items-center gap-x-2">
      <h1 class="text-2xl font-bold tracking-tight">Resume Watching</h1>
      <span
        class="flex h-6 items-center rounded-full bg-yellow-400 px-2 text-xs font-black uppercase tracking-tight text-gray-900"
      >
        BETA
      </span>
    </div>

    <div class="flex gap-2 overflow-x-auto pb-6">
      <div
        v-for="(item, index) in list"
        :key="index"
        @click="
          () => {
            data = item
            watchModal = true
          }
        "
        class="relative cursor-pointer"
      >
        <div
          class="h-40 min-w-[300px] max-w-lg overflow-hidden rounded-2xl sm:h-auto sm:min-w-[512px]"
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

          <div class="absolute bottom-0 w-full p-2 sm:p-4">
            <div
              class="rounded-2xl bg-gray-900/70 px-4 py-2 transition-all hover:bg-gray-900"
            >
              <div class="flex items-center justify-between">
                <div
                  class="flex items-center gap-x-4 font-semibold tracking-tight text-white"
                >
                  <h1
                    class="line-clamp-1 text-xl font-semibold tracking-tight sm:text-2xl"
                  >
                    {{ item.title }}
                  </h1>
                  <span
                    v-if="item.series"
                    class="mt-1 text-sm font-semibold tracking-tight text-gray-300"
                  >
                    S{{ item.series.season }} E{{ item.series.episode }}
                  </span>
                </div>
                <span
                  class="font-maven text-lg font-black text-yellow-500 sm:text-2xl"
                  >m</span
                >
              </div>
              <p class="text-xs tracking-tight sm:text-base">
                Continue watching from
                <span class="font-semibold">{{
                  $moment.duration(item.currentTime, "seconds").format()
                }}</span>
              </p>
            </div>
          </div>
          <MasterImage :source="item.backdrop" class="h-64 w-full" />
        </div>
      </div>
    </div>
  </section>
</template>
