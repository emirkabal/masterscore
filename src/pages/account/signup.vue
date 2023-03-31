<script setup>
import { useUserStore } from "~/store/user"
useHead({
  title: "Signup",
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
    error.value = "Passwords do not match"
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
        Create account
      </p>
      <p v-if="error.length > 0" class="text-center text-red-600">
        {{ error }}
      </p>
      <form @submit="submit" class="mt-2 space-y-4 !text-black">
        <div class="relative">
          <input
            :value="username"
            @input="(e) => (username = e.target.value)"
            type="text"
            placeholder=" "
            class="border-1 peer block w-full appearance-none rounded-lg border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
          />
          <label
            for="floating_outlined"
            class="pointer-events-none absolute top-2 left-1 z-10 origin-[0] -translate-y-5 scale-75 transform bg-white px-2 text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600"
            >Username</label
          >
        </div>
        <div class="relative">
          <input
            :value="email"
            @input="(e) => (email = e.target.value)"
            type="email"
            placeholder=" "
            class="border-1 peer block w-full appearance-none rounded-lg border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
          />
          <label
            for="floating_outlined"
            class="pointer-events-none absolute top-2 left-1 z-10 origin-[0] -translate-y-5 scale-75 transform bg-white px-2 text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600"
            >Email</label
          >
        </div>
        <div class="relative">
          <input
            :value="password"
            @input="(e) => (password = e.target.value)"
            type="password"
            placeholder=" "
            class="border-1 peer block w-full appearance-none rounded-lg border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
          />
          <label
            for="floating_outlined"
            class="pointer-events-none absolute top-2 left-1 z-10 origin-[0] -translate-y-5 scale-75 transform bg-white px-2 text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600"
            >Password</label
          >
        </div>
        <div class="relative">
          <input
            :value="confirmPassword"
            @input="(e) => (confirmPassword = e.target.value)"
            type="password"
            placeholder=" "
            class="border-1 peer block w-full appearance-none rounded-lg border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
          />
          <label
            for="floating_outlined"
            class="pointer-events-none absolute top-2 left-1 z-10 origin-[0] -translate-y-5 scale-75 transform bg-white px-2 text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600"
            >Confirm Password</label
          >
        </div>
        <div class="relative">
          <input
            :value="inviteCode"
            @input="(e) => (inviteCode = e.target.value)"
            type="text"
            placeholder=" "
            class="border-1 peer block w-full appearance-none rounded-lg border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
          />
          <label
            for="floating_outlined"
            class="pointer-events-none absolute top-2 left-1 z-10 origin-[0] -translate-y-5 scale-75 transform bg-white px-2 text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600"
            >Invite Code</label
          >
        </div>

        <input
          v-if="!loading"
          type="submit"
          :disabled="disabled"
          value="Signup"
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
        Already have an account?
        <NuxtLink
          to="/account/login"
          class="font-semibold text-blue-700 hover:underline"
          >Login</NuxtLink
        >
      </p>
    </div>
    <div
      class="absolute top-0 right-0 z-10 hidden h-screen w-full bg-gradient-to-b from-yellow-600/80 backdrop-blur-sm md:block"
    ></div>
    <img
      src="~/assets/images/bg3.jpg"
      class="absolute top-0 left-0 hidden h-screen w-full object-cover opacity-30 md:block"
    />
  </div>
</template>
