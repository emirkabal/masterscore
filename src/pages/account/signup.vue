<script setup>
import { useUserStore } from "~/store/user"
const { t } = useI18n()
useHead({
  title: t("guest.sign_up"),
  titleTemplate: "%s - Masterscore"
})
const userStore = useUserStore()

definePageMeta({
  middleware: ["noauth"],
  layout: "blank"
})

const username = ref("")
const email = ref("")
const password = ref("")
const confirmPassword = ref("")
const inviteCode = ref("")
const error = ref("")
const loading = ref(false)

const disabled = computed(() => {
  return (
    username.value.length === 0 ||
    email.value.length === 0 ||
    password.value.length === 0 ||
    confirmPassword.value.length === 0 ||
    inviteCode.value.length === 0
  )
})

if (userStore.isLoggedIn) {
  useRouter().push("/")
}

const submit = async (event) => {
  event.preventDefault()
  if (password.value !== confirmPassword.value) {
    error.value = t("guest.form.passwords_not_match")
    return
  } else {
    error.value = ""
  }
  loading.value = true
  const data = await $fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({
      username: username.value.toLowerCase(),
      email: email.value.toLowerCase(),
      password: password.value,
      inviteCode: inviteCode.value
    })
  })

  if (data.status === 200) {
    error.value = ""
    userStore.setToken(data.token)
    await userStore.getUserData()
    useRouter().push("/")
  } else {
    loading.value = false
    error.value = grabErrorMessage(data)
  }
}
</script>

<template>
  <div
    class="flex h-screen items-center justify-center bg-white px-4 md:bg-gray-500 md:px-0"
  >
    <div
      class="z-20 w-full max-w-xl rounded-3xl drop-shadow-none md:bg-white md:p-8 md:drop-shadow-2xl"
    >
      <h1 class="text-center">
        <Logo class="text-4xl !text-black" />
      </h1>
      <p class="text-center font-maven text-lg font-black !text-black">
        {{ $t("guest.create_account") }}
      </p>
      <p v-if="error.length > 0" class="text-center text-red-600">
        {{ error }}
      </p>
      <form
        @submit="submit"
        class="mt-2 space-y-4 !text-black"
        autocomplete="off"
      >
        <FormInput
          v-model="username"
          type="text"
          :title="$t('guest.form.username')"
        />
        <FormInput
          v-model="email"
          type="email"
          :title="$t('guest.form.email')"
        />
        <FormInput
          v-model="password"
          type="password"
          :title="$t('guest.form.password')"
        />
        <FormInput
          v-model="confirmPassword"
          type="password"
          :title="$t('guest.form.confirm_password')"
        />
        <FormInput
          v-model="inviteCode"
          type="text"
          :title="$t('guest.form.invite_code')"
        />

        <input
          v-if="!loading"
          type="submit"
          :disabled="disabled"
          :value="$t('guest.sign_up')"
          class="flex h-14 w-full cursor-pointer items-center justify-center rounded-lg bg-blue-700 px-4 py-4 text-white disabled:cursor-default disabled:bg-gray-400 enabled:hover:bg-blue-600"
        />
        <button
          v-else
          type="button"
          class="flex h-14 w-full cursor-auto items-center justify-center gap-2 rounded-lg bg-gray-200 px-4 py-4 text-white"
        >
          <Spinner />
        </button>
      </form>

      <p class="mt-4 text-center !text-black">
        {{ $t("guest.already_have_account") }}
        <NuxtLink
          to="/account/login"
          class="font-semibold text-blue-700 hover:underline"
          >{{ $t("guest.sign_in") }}</NuxtLink
        >
      </p>
    </div>
    <div
      class="fixed bottom-0 left-1/2 z-50 mb-4 block -translate-x-1/2 text-black md:hidden"
    >
      <LangSwitcher :light="true" />
    </div>
    <div class="absolute bottom-0 right-0 z-50 mb-4 mr-12 hidden md:block">
      <LangSwitcher :light="true" />
    </div>
    <div
      class="absolute right-0 top-0 z-10 hidden h-screen w-full bg-gradient-to-b from-yellow-600/80 backdrop-blur-sm md:block"
    ></div>
    <img
      src="~/assets/images/bg3.jpg"
      class="absolute left-0 top-0 hidden h-screen w-full object-cover opacity-30 md:block"
    />
  </div>
</template>
