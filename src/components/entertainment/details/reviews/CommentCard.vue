<script lang="ts" setup>
type User = {
  id: string
  display_name?: string | null
  username: string
  avatar?: string | null
  verified: boolean
}

const props = defineProps<{
  user?: User
  comment: {
    user: User
    rating: number
    content?: string | null
    spoiler?: boolean | null
    created_at: string
    updated_at: string
  }
}>()

const isMe = computed(() => props.comment.user.id === props.user?.id)
</script>

<template>
  <div
    class="relative flex items-start gap-x-4 rounded-xl"
    :class="{
      'bg-brand/15 px-4 pt-6': isMe
    }"
  >
    <NuxtLink :to="`/${comment.user.username}`">
      <Avatar
        :username="comment.user.username"
        :avatar="comment.user.avatar"
        :square="comment.user.verified"
        class="h-10 w-10 flex-shrink-0 md:h-14 md:w-14"
      />
    </NuxtLink>

    <div class="flex w-full min-w-0 flex-col">
      <div class="flex items-center gap-x-1.5">
        <NuxtLink
          :to="`/${comment.user.username}`"
          class="flex min-w-0 items-center gap-1 font-semibold transition hover:opacity-85"
        >
          <span class="truncate break-words">
            {{ comment.user.display_name ?? comment.user.username }}
          </span>
          <Icon
            v-if="comment.user.verified"
            name="material-symbols:verified-rounded"
            class="h-5 w-5 flex-shrink-0 text-brand"
        /></NuxtLink>
        <ScoreCircle :score="comment.rating" />
        <p class="line-clamp-1 flex-shrink-0 cursor-default break-words text-xs text-gray-300">
          <span
            v-tooltip="{
              content: $moment(comment.created_at).locale($i18n.locale).format('LLLL')
            }"
            v-text="$moment(comment.created_at).locale($i18n.locale).calendar()"
          ></span>
          <span
            v-if="comment.created_at !== comment.updated_at"
            v-tooltip="{
              content: $moment(comment.updated_at).locale($i18n.locale).format('LLLL')
            }"
            class="ml-1"
            >({{ $t("edited") }})</span
          >
        </p>
      </div>
      <EntertainmentDetailsReviewsContent :review="comment" class="mt-1" />

      <div class="ml-auto mt-2 flex items-center justify-between">
        <!-- <div v-if="comment.content" class="flex gap-x-4">
          <button
            v-if="!test"
            @click="test = true"
            class="flex items-center justify-center gap-x-1 rounded-full bg-gray-900/50 p-2 text-sm transition hover:bg-gray-900"
          >
            <Icon name="ph:arrow-fat-up" class="h-4 w-4" />
          </button>
          <button
            v-else
            @click="test = false"
            class="flex h-8 items-center justify-center gap-x-1 rounded-full bg-orange-500/20 px-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-500/40"
          >
            <Icon name="ph:arrow-fat-up-fill" />
            <span> 256 </span>
          </button>
        </div> -->

        <DropdownMenu v-if="isMe">
          <DropdownMenuTrigger as-child class="h-8 w-8 rounded-full transition hover:bg-gray-900">
            <button>
              <Icon name="mdi:dots-horizontal" class="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-32">
            <DropdownMenuGroup>
              <DropdownMenuItem @click="$emit('edit')">
                <Icon name="ic:round-edit" class="mr-2 h-5 w-5" />
                <span>{{ $t("edit") }}</span>
              </DropdownMenuItem>
              <DropdownMenuItem class="text-red-400" @click="$emit('delete')">
                <Icon name="ic:outline-delete-forever" class="mr-2 h-5 w-5" />
                <span>{{ $t("delete") }}</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </div>
</template>
