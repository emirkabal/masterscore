<script setup>
import { useUserStore } from "~/store/user"
useHead({
  title: "Login",
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
              class="pointer-events-none absolute left-1 top-2 z-10 origin-[0] -translate-y-5 scale-75 transform bg-white px-2 text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600"
              >Username</label
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
              class="pointer-events-none absolute left-1 top-2 z-10 origin-[0] -translate-y-5 scale-75 transform bg-white px-2 text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600"
              >Password</label
            >
          </div>
          <input
            v-if="!loading"
            type="submit"
            value="Login"
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
          Don't have an account?
          <NuxtLink
            to="/account/signup"
            class="font-semibold text-blue-700 hover:underline"
            >Sign up</NuxtLink
          >
        </p>
      </div>
    </div>
    <div class="hidden h-screen w-full md:block">
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
