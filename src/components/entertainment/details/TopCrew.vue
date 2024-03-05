<script setup lang="ts">
import type { CreditsResult, TMDBData } from "~/types"
const { t } = useI18n()

const props = defineProps<{
  data: TMDBData
}>()

const crew = computed<CreditsResult[]>(() => {
  let list: CreditsResult[] = []
  if (props.data) {
    if (props.data.credits.crew?.length) {
      list.push(
        ...props.data.credits.crew
          .filter((e) =>
            ["Director", "Writer", "Novel", "Screenplay", "Story", "Characters"].includes(e.job)
          )
          .reduce((acc: any, cur: any) => {
            const found = acc.find((e: any) => e.id === cur.id)
            if (found) {
              found.job += `, ${cur.job}`
            } else {
              acc.push(cur)
            }
            return acc
          }, [])
          .slice(0, 6)
      )
    }
    if (props.data.created_by?.length) {
      list.push(
        ...props.data.created_by.map((e) => {
          return {
            ...e,
            job: "Creator"
          }
        })
      )
    }
  }
  return list.sort((a: CreditsResult, b: CreditsResult) => {
    if (a.job.includes("Director")) return -1
    else if (b.job.includes("Director")) return 1
    else if (a.job.includes("Creator")) return -1
    else if (b.job.includes("Creator")) return 1
    else if (a.job.includes("Novel")) return -1
    else if (b.job.includes("Novel")) return 1
    return 0
  })
})

const localizedJobs = (job: string) => {
  return job
    .split(",")
    .map((e: string) => {
      let j = e.trim()
      return t(`jobs.${j.toLowerCase()}`) || j
    })
    .join(", ")
}
</script>

<template>
  <div>
    <div class="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-0">
      <div
        v-for="member in crew"
        :key="member.id"
        class="rounded-xl bg-gray-900/40 px-4 py-2 lg:bg-transparent lg:px-0"
      >
        <NuxtLink
          :to="`/person/${member.id}`"
          class="font-semibold transition-colors hover:text-white/80"
        >
          {{ member.name }}
        </NuxtLink>
        <p class="text-white/80">{{ localizedJobs(member.job) }}</p>
      </div>
    </div>
  </div>
</template>
