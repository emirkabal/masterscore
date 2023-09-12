<script setup>
import { useUserStore } from "~/store/user"
const { t } = useI18n()
useHead({
  title: t("guest.sign_in"),
  titleTemplate: "%s - Masterscore"
})
const userStore = useUserStore()

definePageMeta({
  middleware: ["noauth"],
  layout: "blank"
})

const username = ref("")
const password = ref("")
const error = ref("")
const loading = ref(false)

if (userStore.isLoggedIn) {
  useRouter().push("/")
}

const submit = async (event) => {
  event.preventDefault()
  loading.value = true
  const data = await userStore.login(username.value, password.value)
  if (data.status === 200) {
    error.value = ""
    useRouter().push("/")
  } else {
    loading.value = false
    error.value = data.message
  }
}
</script>

<template>
  <div class="flex h-screen w-full">
    <div class="z-10 h-screen w-full bg-white p-8 md:max-w-md">
      <div class="mt-48 rounded-3xl md:bg-white md:p-8">
        <h1 class="text-center">
          <Logo class="text-4xl !text-black" />
        </h1>
        <p v-if="error.length > 0" class="text-center text-red-600">
          {{ error }}
        </p>
        <form @submit="submit" class="mt-2 space-y-4 !text-black">
          <FormInput
            v-model="username"
            type="text"
            :title="$t('guest.form.username')"
          />
          <FormInput
            v-model="password"
            type="password"
            :title="$t('guest.form.password')"
          />
          <input
            v-if="!loading"
            type="submit"
            :value="$t('guest.sign_in')"
            class="h-14 w-full cursor-pointer rounded-lg bg-blue-700 px-4 py-4 text-white hover:bg-blue-600"
          />
          <button
            v-else
            type="button"
            class="flex h-14 w-full cursor-auto items-center justify-center gap-2 rounded-lg bg-gray-200 px-4 py-4 text-white"
          >
            <Spinner />
          </button>
        </form>
        <p class="mt-3 text-center !text-black">
          {{ $t("guest.dont_have_account") }}
          <NuxtLink
            :to="'/account/signup'"
            class="font-semibold text-blue-700 hover:underline"
            >{{ $t("guest.sign_up") }}</NuxtLink
          >
        </p>
      </div>
    </div>
    <div
      class="fixed bottom-0 left-1/2 z-50 mb-4 block -translate-x-1/2 text-black md:hidden"
    >
      <LangSwitcher :light="true" />
    </div>

    <div class="hidden h-screen w-full md:block">
      <div class="absolute bottom-0 right-0 z-50 mb-4 mr-12">
        <LangSwitcher :light="true" />
      </div>
      <div
        class="absolute right-0 top-0 h-screen w-full bg-gradient-to-r from-yellow-600 backdrop-blur-sm"
      ></div>
      <img
        src="~/assets/images/bg.jpg"
        draggable="false"
        class="left-0 top-0 h-screen w-full object-cover object-center"
      />
    </div>
  </div>
</template>
