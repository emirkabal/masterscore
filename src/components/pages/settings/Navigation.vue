<script lang="ts" setup>
const { t } = useI18n()

const tabs = reactive([
  {
    id: "settings-account",
    name: t("settings.account"),
    active: false
  },
  {
    id: "settings-profile",
    name: t("settings.profile"),
    active: false
  },
  {
    id: "settings-preferences",
    name: t("settings.preferences"),
    active: false
  }
])

const goTo = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    window.scrollTo({
      top: el.offsetTop - 96,
      behavior: "smooth"
    })
  }
}

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.parentElement?.id
          tabs.forEach((tab) => {
            tab.active = tab.id === id
          })
        }
      })
    },
    {
      rootMargin: "0px 0px -60% 0px",
      threshold: 0.5
    }
  )

  document.querySelectorAll("#tabs > section h3").forEach((section) => {
    observer.observe(section)
  })
})
</script>

<template>
  <ul class="space-y-4">
    <li
      v-for="tab in tabs"
      :key="tab.id"
      @click="goTo(tab.id)"
      :class="[
        tab.active ? 'bg-gray-900/60 text-white' : 'text-gray-500',
        'block cursor-pointer rounded-lg px-4 py-2 text-lg font-semibold tracking-tight'
      ]"
    >
      {{ tab.name }}
    </li>
  </ul>
</template>
