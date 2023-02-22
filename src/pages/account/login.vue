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
    <div class="bg-white md:max-w-md w-full h-screen p-8 z-10">
      <div class="md:bg-white mt-48 rounded-3xl md:p-8">
        <h1 class="text-center">
          <Logo class="text-4xl !text-black" />
        </h1>
        <p v-if="error.length > 0" class="text-center text-red-600">
          {{ error }}
        </p>
        <form @submit="submit" class="space-y-4 mt-2 !text-black">
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
          <input
            type="submit"
            value="Login"
            class="bg-blue-700 cursor-pointer hover:bg-blue-600 rounded-full text-white px-4 py-4 w-full"
          />
        </form>
        <p class="text-center mt-3 !text-black">
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
