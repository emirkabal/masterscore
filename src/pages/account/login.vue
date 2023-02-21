<script setup>
import { useUserStore } from "~/store/user"
const userStore = useUserStore()

definePageMeta({
  layout: "blank"
})

const username = ref("")
const password = ref("")
const error = ref("")

if (userStore.isLoggedIn) {
  useRouter().push("/")
}

const submit = async (event) => {
  event.preventDefault()
  const data = await userStore.login(username.value, password.value)
  console.log(data)
  if (data.status === 200) {
    error.value = ""
    useRouter().push("/")
  } else {
    error.value = data.message
  }
}
</script>

<template>
  <div class="w-full h-screen flex">
    <div class="md:bg-zinc-900 bg-white md:max-w-md w-full h-screen p-8 z-10">
      <div class="md:bg-white mt-48 rounded-3xl md:p-8">
        <h1 class="font-black font-maven text-4xl text-center">masterscore</h1>
        <p class="font-black font-maven text-lg text-center">
          Login to account
        </p>
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
          <p>Password</p>
          <input
            :value="password"
            @input="(e) => (password = e.target.value)"
            type="password"
            class="rounded w-full"
          />
          <input
            type="submit"
            value="Login"
            class="bg-blue-700 cursor-pointer hover:bg-blue-600 rounded-full text-white px-4 py-4 w-full"
          />
        </form>
        <p class="text-center mt-3">
          Don't have an account?
          <router-link
            to="/account/signup"
            class="hover:underline text-blue-700 font-semibold"
            >Sign up</router-link
          >
        </p>
      </div>
    </div>
    <div class="w-full h-screen md:block hidden">
      <img
        src="~/assets/images/bg4.jpg"
        draggable="false"
        class="top-0 left-0 w-full h-screen object-cover object-center"
      />
    </div>
  </div>
</template>
