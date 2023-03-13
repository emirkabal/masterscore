<script setup lang="ts">
const { params } = useRoute()

const { data, pending } = useFetch(`/api/person/details/${params.id}`)

const gender = computed(() => {
  if (!data.value || "status" in data.value) return 0
  return data.value.gender === 1 ? "Female" : "Male"
})
</script>
<template>
  <div v-if="pending || !data">
    <Spinner />
  </div>
  <div v-else-if="'status' in data">
    <h1>Not found</h1>
  </div>
  <div v-else>
    <div class="container mx-auto mt-8 mb-28 px-4">
      <div class="flex flex-col items-stretch justify-center gap-8 md:flex-row">
        <div class="w-full md:min-w-[300px] md:max-w-[300px]">
          <img
            :src="`https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${data.profile_path}`"
            draggable="false"
            alt="profile picture"
            loading="lazy"
            class="h-auto w-full rounded-lg shadow-lg"
          />
          <div>
            <h2 class="mt-4 mb-4 text-2xl font-semibold tracking-tighter">
              Personal Info
            </h2>
            <div class="personal space-y-2">
              <p v-if="data.known_for_department">
                <strong>Known For</strong>
                {{ data.known_for_department }}
              </p>
              <p v-if="data.gender">
                <strong>Gender</strong>
                {{ gender }}
              </p>
              <p v-if="data.birthday">
                <strong>Birthday</strong>
                {{ data.birthday }}
              </p>
              <p v-if="data.deathday">
                <strong>Deathday</strong>
                {{ data.deathday }}
              </p>
              <p v-if="data.place_of_birth">
                <strong>Place of Birth</strong>
                {{ data.place_of_birth }}
              </p>
              <p v-if="data.also_known_as.length !== 0">
                <strong>Also known as</strong>
                {{ data.also_known_as.join(", ") }}
              </p>
            </div>
          </div>
        </div>
        <div class="min-w-0 max-w-4xl flex-1 space-y-6">
          <h1 class="font-maven text-3xl font-bold tracking-wide">
            {{ data.name }}
          </h1>
          <div class="space-y-2">
            <h1 class="font-maven text-2xl font-bold tracking-wide">
              Biography
            </h1>
            <p class="whitespace-pre-wrap leading-5">{{ data.biography }}</p>
          </div>
          <div>
            <h1 class="font-maven text-2xl font-bold tracking-wide">
              Known For
            </h1>
            <p class="whitespace-pre-wrap leading-5">
              <span
                class="select-none font-maven text-lg font-black text-yellow-500"
                >m</span
              >
              Coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.personal p strong {
  @apply block font-semibold;
}
.personal p {
  @apply block font-maven;
}
</style>
