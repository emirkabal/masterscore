<script setup>
import { useUserStore } from "~/store/user"
const userStore = useUserStore()

definePageMeta({
  layout: "blank"
})

const username = ref("")
const email = ref("")
const password = ref("")
const confirmPassword = ref("")
const inviteCode = ref("")
const error = ref("")

const disabled = computed(() => {
  return (
    username.value.length === 0 ||
    email.value.length === 0 ||
    password.value.length === 0 ||
    confirmPassword.value.length === 0 ||
    password.value !== confirmPassword.value ||
    inviteCode.value.length === 0
  )
})

console.log(disabled.value)

watch([password, confirmPassword], () => {
  if (password.value !== confirmPassword.value) {
    error.value = "Passwords do not match"
  } else {
    error.value = ""
  }
})

if (userStore.isLoggedIn) {
  useRouter().push("/")
}

const submit = async (event) => {
  event.preventDefault()
  const data = await $fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({
      username: username.value,
      email: email.value,
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
    error.value = grabErrorMessage(data)
  }
}
</script>

<template>
  <div
    class="flex items-center justify-center h-screen bg-white md:bg-gray-500 px-4 md:px-0"
  >
    <div class="md:bg-white max-w-xl w-full rounded-3xl md:p-8 z-10">
      <h1 class="font-black font-maven text-4xl text-center">
        <span class="text-yellow-500">m</span>asterscore
      </h1>
      <p class="font-black font-maven text-lg text-center">Create account</p>
      <p v-if="error.length > 0" class="text-center text-red-600">
        {{ error }}
      </p>
      <form @submit="submit" class="space-y-4 mt-2">
        <div class="relative">
          <input
            :value="username"
            @input="(e) => (username = e.target.value)"
            type="text"
            placeholder=" "
            class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          />
          <label
            for="floating_outlined"
            class="absolute text-gray-500 duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 left-1 pointer-events-none"
            >Username</label
          >
        </div>
        <div class="relative">
          <input
            :value="email"
            @input="(e) => (email = e.target.value)"
            type="email"
            placeholder=" "
            class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          />
          <label
            for="floating_outlined"
            class="absolute text-gray-500 duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 left-1 pointer-events-none"
            >Email</label
          >
        </div>
        <div class="relative">
          <input
            :value="password"
            @input="(e) => (password = e.target.value)"
            type="password"
            placeholder=" "
            class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          />
          <label
            for="floating_outlined"
            class="absolute text-gray-500 duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 left-1 pointer-events-none"
            >Password</label
          >
        </div>
        <div class="relative">
          <input
            :value="confirmPassword"
            @input="(e) => (confirmPassword = e.target.value)"
            type="password"
            placeholder=" "
            class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          />
          <label
            for="floating_outlined"
            class="absolute text-gray-500 duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 left-1 pointer-events-none"
            >Confirm Password</label
          >
        </div>
        <div class="relative">
          <input
            :value="inviteCode"
            @input="(e) => (inviteCode = e.target.value)"
            type="text"
            placeholder=" "
            class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          />
          <label
            for="floating_outlined"
            class="absolute text-gray-500 duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 left-1 pointer-events-none"
            >Invite Code</label
          >
        </div>

        <input
          type="submit"
          :disabled="disabled"
          value="Signup"
          class="bg-blue-700 cursor-pointer disabled:bg-gray-400 disabled:cursor-default hover:bg-blue-600 rounded-full text-white px-4 py-4 w-full"
        />
      </form>
      <p class="text-center mt-4">
        Already have an account?
        <router-link
          to="/account/login"
          class="font-semibold text-blue-700 hover:underline"
          >Login</router-link
        >
      </p>
    </div>
    <img
      src="~/assets/images/bg.jpg"
      class="absolute top-0 left-0 h-screen w-full object-cover hidden md:block opacity-30"
    />
  </div>
</template>
