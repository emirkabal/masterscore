<script setup>
import debounce from "lodash.debounce"

const search = ref("")
const loading = ref(false)
const results = ref([])
const persons = ref([])
const users = ref([])
const selectedIndex = ref(0)

const searchResults = debounce(async () => {
  const data = await $fetch(`/api/search?q=${search.value}`)
  // selectedIndex.value = 0
  loading.value = false
  if (data.status !== 200) {
    return
  }
  results.value = data.tmdb
  persons.value = data.persons
  users.value = data.users
}, 500)

const searchInput = (e) => {
  search.value = e.target.value
  loading.value = true
  searchResults()
}
</script>
<template>
  <div class="relative max-w-lg flex-grow">
    <div
      v-if="search.length > 0"
      class="fixed top-0 left-0 z-20 h-screen w-full bg-black/20 backdrop-blur"
    ></div>
    <div class="relative z-20 w-full">
      <IconsSearch
        class="absolute left-2"
        :class="{
          'top-[9px]': search.length === 0,
          'top-4': search.length > 0
        }"
      />
      <input
        :value="search"
        @input="searchInput"
        @keydown.arrow-down="
          (e) => {
            e.preventDefault()
            selectedIndex =
              selectedIndex < results.length + persons.length + users.length - 1
                ? selectedIndex + 1
                : selectedIndex
          }
        "
        @keydown.arrow-up="
          (e) => {
            e.preventDefault()
            selectedIndex =
              selectedIndex > 0 ? selectedIndex - 1 : selectedIndex
          }
        "
        @keydown.enter="
          (e) => {
            e.preventDefault()
            if (loading) {
              return
            }
            if (selectedIndex < results.length) {
              $router.push(
                `/details/${results[selectedIndex].media_type}/${results[selectedIndex].id}`
              )
            } else if (selectedIndex < results.length + persons.length) {
              $router.push(
                `/details/person/${persons[selectedIndex - results.length].id}`
              )
            } else if (
              selectedIndex <
              results.length + persons.length + users.length
            ) {
              $router.push(
                `/users/${
                  users[selectedIndex - results.length - persons.length]
                }`
              )
            }
            selectedIndex = 0
            search = ''
          }
        "
        @keydown.esc="
          (e) => {
            e.preventDefault()
            search = ''
          }
        "
        type="text"
        class="w-full rounded-lg border-none bg-white pl-10 shadow dark:bg-black dark:placeholder:text-gray-300"
        :class="{
          'rounded-tl-2xl rounded-tr-2xl rounded-bl-none rounded-br-none pt-4 focus:ring-0':
            search.length > 0
        }"
        placeholder="Type to search..."
      />
    </div>
    <div
      v-if="search.length > 0"
      class="absolute z-20 w-full rounded-bl-2xl rounded-br-2xl bg-white p-4 dark:bg-black"
    >
      <div class="flex justify-center" v-if="loading">
        <Spinner color="#000" />
      </div>
      <div
        v-else-if="
          results.length === 0 && users.length === 0 && persons.length === 0
        "
      >
        <p class="text-center text-gray-500 dark:text-gray-300">
          No results found
        </p>
      </div>
      <div v-else>
        <div v-if="results.length !== 0">
          <div class="mb-2 font-bold text-gray-500 dark:text-gray-300">
            Movies & TV Shows
          </div>

          <div v-for="(result, i) in results" :key="i">
            <router-link
              :to="`/details/${result.media_type}/${result.id}`"
              @mouseenter="selectedIndex = i"
              class="block w-full overflow-hidden rounded-lg p-1.5 transition-colors"
              @click="search = ''"
              :data-index="i"
              :class="{
                'bg-gray-100 dark:bg-zinc-900': i === selectedIndex,
                'bg-white dark:bg-black': i !== selectedIndex
              }"
            >
              <div class="flex w-full items-center">
                <img
                  :src="`https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${result.poster_path}`"
                  class="h-auto w-10 rounded"
                />
                <div class="ml-2 max-w-sm">
                  <p class="truncate text-ellipsis font-bold">
                    {{ $getTitle(result) }}
                  </p>
                  <p class="text-gray-500 dark:text-gray-300">
                    {{
                      (
                        result.first_air_date ||
                        result.release_date ||
                        "-"
                      ).split("-")[0]
                    }}
                  </p>
                </div>
              </div>
            </router-link>
          </div>
        </div>
        <div v-if="persons.length !== 0">
          <div class="mb-2 font-bold text-gray-500 dark:text-gray-300">
            Persons
          </div>
          <div v-for="(person, i) in persons" :key="`person-${i}`">
            <router-link
              :to="`/details/person/${person.id}`"
              @mouseenter="selectedIndex = i + results.length"
              @click="search = ''"
              class="block w-full overflow-hidden rounded-lg p-1.5 transition-colors"
              :data-index="i + results.length"
              :class="{
                'bg-gray-100 dark:bg-zinc-900':
                  i + results.length === selectedIndex,
                'bg-white dark:bg-black': i + results.length !== selectedIndex
              }"
            >
              <div class="flex w-full items-center">
                <img
                  :src="`https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${person.profile_path}`"
                  class="h-auto w-10 rounded"
                />
                <div class="ml-2 max-w-sm">
                  <p class="truncate text-ellipsis font-bold">
                    {{ person.name }}
                  </p>
                </div>
              </div>
            </router-link>
          </div>
        </div>
        <div v-if="users.length !== 0">
          <div class="mb-2 font-bold text-gray-500 dark:text-gray-300">
            Users
          </div>
          <div v-for="(user, i) in users" :key="`user-${i}`">
            <router-link
              :to="`/users/@${user}`"
              @mouseenter="selectedIndex = i + results.length + persons.length"
              @click="search = ''"
              class="block w-full overflow-hidden rounded-lg p-1.5 transition-colors"
              :data-index="i + results.length"
              :class="{
                'bg-gray-100 dark:bg-zinc-900':
                  i + (results.length + persons.length) === selectedIndex,
                'bg-white dark:bg-black':
                  i + (results.length + persons.length) !== selectedIndex
              }"
            >
              <div class="flex w-full items-center">
                <Avatar :username="user" class="h-10 w-10 border" />
                <div class="ml-2 max-w-sm">
                  <p class="truncate text-ellipsis font-bold">@{{ user }}</p>
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <!-- <router-link
          to="/"
          class="bg-white hover:bg-gray-50 transition-colors rounded-3xl p-2 w-full block"
        >
          <div class="flex items-center">
            <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div class="ml-2">
              <p class="font-bold">@username</p>
            </div>
          </div>
        </router-link> -->
      </div>
    </div>
  </div>
</template>
