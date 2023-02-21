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
  <div class="flex items-center justify-center h-screen bg-zinc-900">
    <div class="md:bg-white max-w-xl w-full rounded-3xl md:p-8 z-10">
      <h1 class="font-black font-maven text-4xl text-center">masterscore</h1>
      <p class="font-black font-maven text-lg text-center">Create account</p>
      <p v-if="error.length > 0" class="text-center text-red-600">
        {{ error }}
      </p>
      <form @submit="submit" class="space-y-4 mt-2">
        <p>Username</p>
        <input
          :value="username"
          @input="(e) => (username = e.target.value)"
          type="text"
          class="rounded w-full"
        />
        <p>Email</p>
        <input
          :value="email"
          @input="(e) => (email = e.target.value)"
          type="email"
          class="rounded w-full"
        />
        <p>Password</p>
        <input
          :value="password"
          @input="(e) => (password = e.target.value)"
          type="password"
          class="rounded w-full"
        />
        <p>Confirm Password</p>
        <input
          :value="confirmPassword"
          @input="(e) => (confirmPassword = e.target.value)"
          type="password"
          class="rounded w-full"
        />

        <p>Invite Code</p>
        <input
          :value="inviteCode"
          @input="(e) => (inviteCode = e.target.value)"
          type="text"
          class="rounded w-full"
        />

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
      src="~/assets/images/bg2.jpg"
      class="absolute top-0 left-0 h-screen w-full object-cover opacity-10"
    />
  </div>
</template>
