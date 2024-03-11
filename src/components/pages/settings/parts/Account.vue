<script setup lang="ts">
import { useUserStore } from "~/store/user"
const userStore = useUserStore()

defineProps<{
  settings: any
}>()

const isUsernameChangeDisabled = computed(() => {
  return (
    userStore.user?.username_changed_at &&
    Date.now() - new Date(userStore.user.username_changed_at).getTime() < 7 * 24 * 60 * 60 * 1000
  )
})
</script>

<template>
  <section id="settings-account">
    <h3 class="mb-9 border-b border-gray-800 pb-4 text-3xl font-bold text-white lg:text-5xl">
      {{ $t("settings.account") }}
    </h3>
    <div class="w-full space-y-12 rounded-xl border border-gray-800 bg-gray-900/40 p-4 md:p-12">
      <div>
        <span class="block text-base font-semibold text-white md:text-lg">
          {{ $t("settings.props.display_name") }}
        </span>
        <Input
          class="mt-1 h-10 w-full"
          v-model="settings.account.display_name"
          placeholder="John Doe"
        />
      </div>
      <div>
        <span class="block text-base font-semibold text-white md:text-lg">
          {{ $t("settings.username") }}
        </span>
        <Input
          class="mt-1 h-10 w-full"
          v-model="settings.account.username"
          :disabled="isUsernameChangeDisabled"
          placeholder="john.doe"
        />
        <p class="mt-1 text-xs text-muted-foreground sm:text-sm md:text-base">
          {{ $t("settings.username_notice", [7]) }}
        </p>
      </div>
      <div class="flex items-center justify-between">
        <div>
          <span class="block text-base font-semibold text-white md:text-lg"> E-posta </span>
          <p class="mt-1 text-xs leading-4 text-muted-foreground sm:text-sm md:text-base">
            {{ userStore.user?.email }}
          </p>
        </div>
        <Button>
          {{ $t("settings.change") }}
        </Button>
      </div>
      <div class="flex items-center justify-between">
        <div>
          <span class="block text-base font-semibold text-white md:text-lg"> Şifre </span>
          <p class="mt-1 text-xs leading-4 text-muted-foreground sm:text-sm md:text-base">
            Hesabınızın şifresini değiştirin.
          </p>
        </div>
        <Button>
          {{ $t("settings.change") }}
        </Button>
      </div>
    </div>
  </section>
</template>
