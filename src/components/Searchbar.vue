<script setup>
import debounce from "lodash.debounce"

const search = ref("")
const loading = ref(false)
const results = ref([])
const users = ref([])
const selectedIndex = ref(0)

const searchResults = debounce(async () => {
  console.log("searching...")
  const data = await $fetch(`/api/search?q=${search.value}`)
  // selectedIndex.value = 0
  loading.value = false
  if (data.status !== 200) {
    console.log(data.message)
    return
  }
  console.log(data)
  results.value = data.tmdb
  users.value = data.users
}, 500)

const searchInput = (e) => {
  search.value = e.target.value
  loading.value = true
  searchResults()
}
</script>
<template>
  <div class="flex-grow max-w-lg relative">
    <div
      v-if="search.length > 0"
      class="fixed bg-black/20 top-0 left-0 w-full h-screen z-20 backdrop-blur"
    ></div>
    <div class="w-full relative z-20">
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
              selectedIndex < results.length + users.length - 1
                ? selectedIndex + 1
                : results.length + users.length - 1
          }
        "
        @keydown.arrow-up="
          (e) => {
            e.preventDefault()
            selectedIndex = selectedIndex > 0 ? selectedIndex - 1 : 0
          }
        "
        @keydown.enter="
          (e) => {
            e.preventDefault()
            if (selectedIndex < results.length) {
              $router.push(
                `/details/${results[selectedIndex].media_type}/${results[selectedIndex].id}`
              )
            } else {
              $router.push(`/users/${users[selectedIndex - results.length]}`)
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
        class="w-full pl-10 rounded-lg bg-white shadow border-none"
        :class="{
          'rounded-tl-2xl rounded-tr-2xl rounded-bl-none rounded-br-none focus:ring-0 pt-4':
            search.length > 0
        }"
        placeholder="Type to search..."
      />
    </div>
    <div
      v-if="search.length > 0"
      class="absolute w-full bg-white p-4 rounded-bl-2xl rounded-br-2xl z-20"
    >
      <div class="flex justify-center" v-if="loading">
        <Spinner color="#000" />
      </div>
      <div v-else-if="results.length === 0 && users.length === 0">
        <p class="text-center text-gray-500">No results found</p>
      </div>
      <div v-else>
        <div v-if="results.length !== 0">
          <div class="text-gray-500 font-bold mb-2">Movies & TV Shows</div>

          <div v-for="(result, i) in results" :key="i">
            <router-link
              :to="`/details/${result.media_type}/${result.id}`"
              @mouseenter="selectedIndex = i"
              class="transition-colors rounded-lg overflow-hidden p-3 w-full block"
              @click="search = ''"
              :data-index="i"
              :class="{
                'bg-gray-100': i === selectedIndex,
                'bg-white': i !== selectedIndex
              }"
            >
              <div class="flex items-center w-full">
                <div
                  class="w-14 h-[84px] flex items-center justify-center font-bold text-white rounded bg-gray-600"
                  v-if="!result.poster_path"
                >
                  X
                </div>
                <img
                  v-else
                  :src="`https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${result.poster_path}`"
                  class="w-14 h-auto rounded"
                />
                <div class="ml-4 max-w-sm">
                  <p class="font-bold text-ellipsis truncate">
                    {{ result.title || result.name }}
                  </p>
                  <p class="text-gray-500">
                    {{
                      (result.first_air_date || result.release_date).split(
                        "-"
                      )[0]
                    }}
                  </p>
                </div>
              </div>
            </router-link>
          </div>
        </div>
        <div v-if="users.length !== 0">
          <div class="text-gray-500 font-bold mb-2">Users</div>
          <div v-for="(user, i) in users" :key="`user-${i}`">
            <router-link
              :to="`/users/@${user}`"
              @mouseenter="selectedIndex = i + results.length"
              @click="search = ''"
              class="transition-colors rounded-lg overflow-hidden p-3 w-full block"
              :data-index="i + results.length"
              :class="{
                'bg-gray-100': i + results.length === selectedIndex,
                'bg-white': i + results.length !== selectedIndex
              }"
            >
              <div class="flex items-center w-full">
                <Avatar :username="user" class="w-10 h-10 border" />
                <div class="ml-4 max-w-sm">
                  <p class="font-bold text-ellipsis truncate">@{{ user }}</p>
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
