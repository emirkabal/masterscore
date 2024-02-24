<script lang="ts" setup>
import { useUserStore } from "~/store/user"
const { user, isLoggedIn } = useUserStore()

const props = defineProps<{ id?: string }>()

const inWatchlist = computed(() => {
  return user?.watchlist?.includes(props.id || "")
})

const handleWatchlist = async () => {
  if (!isLoggedIn || !user || !user.watchlist) {
    return useRouter().push("/account/login")
  }

  if (!props.id) return

  if (inWatchlist.value) {
    user.watchlist = user.watchlist.filter((e) => e !== props.id)
  } else {
    user.watchlist.push(props.id)
  }

  await $fetch("/api/users/me/watchlist", {
    method: "POST",
    body: JSON.stringify({
      id: props.id,
      type: inWatchlist.value ? "add" : "remove"
    }),
    headers: generateHeaders()
  })
}
</script>

<template>
  <div class="flex h-24 items-center justify-between px-6">
    <button
      @click="handleWatchlist"
      class="flex items-center gap-2 rounded-full bg-gray-400/20 p-4 font-semibold hover:bg-gray-400/40"
      v-tooltip="{
        content: inWatchlist ? $t('entertainment.buttons.remove') : $t('entertainment.buttons.save')
      }"
    >
      <Icon
        v-if="!inWatchlist"
        name="material-symbols:bookmark-add-outline-rounded"
        class="h-7 w-7 text-gray-200"
      />
      <Icon v-else name="material-symbols:bookmark-remove-rounded" class="h-7 w-7 text-gray-200" />
    </button>
    <button
      class="flex items-center rounded-full bg-gray-400/20 py-2 font-semibold hover:bg-gray-400/40"
    >
      <Icon name="material-symbols:play-arrow-rounded" class="h-8 w-auto px-2 text-gray-200" />
      <span class="pr-4"> Play Trailer </span>
    </button>
  </div>
</template>
