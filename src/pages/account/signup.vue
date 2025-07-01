<script setup>
import { useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { useUserStore } from "~/store/user"
const { t } = useI18n()
useHead({
  title: t("guest.sign_up"),
  titleTemplate: "%s - Masterscore",
  link: [
    {
      rel: "canonical",
      href: "https://masterscore.org/account/signup"
    }
  ]
})
const userStore = useUserStore()

definePageMeta({
  middleware: ["noauth"],
  layout: "blank"
})

const route = useRoute()
const goPath = route.query.r || "/"

const error = ref("")
const loading = ref(false)

if (userStore.isLoggedIn) {
  useRouter().push(goPath)
}

const formSchema = toTypedSchema(SignupSchema)
const form = useForm({
  validationSchema: formSchema
})

const onSubmit = form.handleSubmit(async (values) => {
  if (values.password !== values.confirm_password)
    return form.setFieldError("confirm_password", "Passwords do not match")

  loading.value = true
  try {
    const data = await $fetch("/api/account/signup", {
      method: "POST",
      body: JSON.stringify({
        username: values.username.toLowerCase(),
        email: values.email.toLowerCase(),
        password: values.password,
        confirm_password: values.confirm_password
      })
    })

    error.value = ""
    userStore.setToken(data.token)
    await userStore.getUserData()
    useRouter().push(goPath)
  } catch (err) {
    loading.value = false
    error.value = err.statusMessage || err.message || "An error occurred"
  }
})
</script>

<template>
  <div class="flex h-screen items-center justify-center bg-white px-4 md:bg-gray-500 md:px-0">
    <div
      class="z-20 w-full max-w-xl rounded-3xl drop-shadow-none md:bg-white md:p-8 md:drop-shadow-2xl"
    >
      <h1 class="text-center">
        <Logo class="mx-auto w-20" :black="true" />
      </h1>
      <p class="text-center font-maven text-lg font-black !text-black">
        {{ $t("guest.create_account") }}
      </p>
      <p v-if="error.length > 0" class="text-center text-red-600">
        {{ error }}
      </p>

      <form @submit="onSubmit" class="mt-2 space-y-4">
        <FormField v-slot="{ componentField }" name="username">
          <FormItem>
            <FormLabel class="font-semibold text-black">{{ $t("guest.form.username") }}</FormLabel>
            <FormControl>
              <FormInput type="text" placeholder="john.doe" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel class="font-semibold text-black">{{ $t("guest.form.email") }}</FormLabel>
            <FormControl>
              <FormInput type="email" placeholder="john@doe.com" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel class="font-semibold text-black">{{ $t("guest.form.password") }}</FormLabel>
            <FormControl>
              <FormInput
                type="password"
                autocomplete="new-password"
                placeholder="••••••••••"
                :reveal="true"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="confirm_password">
          <FormItem>
            <FormLabel class="font-semibold text-black">{{
              $t("guest.form.confirm_password")
            }}</FormLabel>
            <FormControl>
              <FormInput
                type="password"
                autocomplete="new-password"
                placeholder="••••••••••"
                :reveal="true"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormButton type="submit" class="w-full" :loading="loading">
          {{ $t("guest.sign_up") }}
        </FormButton>
      </form>

      <p class="mt-4 text-center !text-black">
        {{ $t("guest.already_have_account") }}
        <NuxtLink
          :to="`/account/login${goPath !== '/' ? `?r=${goPath}` : ''}`"
          class="font-semibold text-blue-700 hover:underline"
          >{{ $t("guest.sign_in") }}</NuxtLink
        >
      </p>
    </div>
    <div class="fixed bottom-0 left-1/2 z-50 mb-4 block -translate-x-1/2 md:hidden">
      <LangSwitcher />
    </div>
    <div class="absolute bottom-0 right-0 z-50 mb-4 mr-12 hidden md:block">
      <LangSwitcher />
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
