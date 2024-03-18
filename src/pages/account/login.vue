<script setup>
import { useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { useUserStore } from "~/store/user"
const { t } = useI18n()
useHead({
  title: t("guest.sign_in"),
  titleTemplate: "%s - Masterscore",
  link: [
    {
      rel: "canonical",
      href: "https://masterscore.org/account/login"
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

const formSchema = toTypedSchema(LoginSchema)
const form = useForm({
  validationSchema: formSchema
})

const onSubmit = form.handleSubmit(async (values) => {
  loading.value = true
  try {
    await userStore.login(values.username, values.password)
    error.value = ""
    useRouter().push(goPath)
  } catch (err) {
    loading.value = false
    error.value = err.statusMessage || "An error occurred"
  }
})
</script>

<template>
  <div class="flex h-screen w-full">
    <div class="z-10 h-screen w-full bg-white p-4 md:max-w-md md:p-8">
      <div class="mt-32 rounded-3xl md:bg-white md:p-8">
        <div class="mb-4 text-center md:text-left">
          <Logo
            :black="true"
            class="absolute left-0 top-0 m-4 text-2xl md:relative md:m-0 md:text-lg"
          />
          <h1 class="mt-4 font-maven text-4xl font-black text-black">
            {{ $t("guest.sign_in") }}
          </h1>
          <p v-if="error.length > 0" class="my-4 leading-4 text-red-600">
            {{ error }}
          </p>
        </div>

        <form @submit="onSubmit" class="mt-2 space-y-4">
          <FormField v-slot="{ componentField }" name="username">
            <FormItem>
              <FormLabel class="font-semibold text-black">{{
                $t("guest.form.email_or_username")
              }}</FormLabel>
              <FormControl>
                <FormInput type="text" placeholder="john@doe.com" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel class="font-semibold text-black">{{
                $t("guest.form.password")
              }}</FormLabel>
              <FormControl>
                <FormInput
                  type="password"
                  placeholder="••••••••••"
                  :reveal="true"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormButton type="submit" class="w-full" :loading="loading">
            {{ $t("guest.sign_in") }}
          </FormButton>
        </form>

        <!-- <form @submit="submit" class="mt-2 space-y-4 !text-black">
          <FormInput
            v-model="username"
            type="text"
            :title="$t('guest.form.email_or_username')"
            placeholder="john@doe.com"
          />
          <FormInput
            v-model="password"
            type="password"
            :reveal="true"
            :title="$t('guest.form.password')"
            placeholder="••••••••••"
          />
          <FormButton class="w-full" type="submit" :loading="loading">
            {{ $t("guest.sign_in") }}
          </FormButton>
        </form> -->
        <p class="mt-3 text-center !text-black">
          {{ $t("guest.dont_have_account") }}
          <NuxtLink
            :to="`/account/signup${goPath !== '/' ? `?r=${goPath}` : ''}`"
            class="font-semibold text-blue-700 hover:underline"
            >{{ $t("guest.sign_up") }}</NuxtLink
          >
        </p>
      </div>
    </div>
    <div class="fixed bottom-0 left-1/2 z-50 mb-4 block -translate-x-1/2 text-black md:hidden">
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
