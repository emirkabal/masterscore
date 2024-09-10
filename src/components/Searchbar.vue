<script setup>
import debounce from "lodash.debounce"
import { onKeyStroke, useStorage } from "@vueuse/core"
const { $event, $tlink } = useNuxtApp()
const { isMacOS } = useDevice()
const search = ref("")
const loading = ref(false)
const results = ref([])
const persons = ref([])
const users = ref([])
const selectedIndex = ref(0)
const focused = ref(false)
const inputElement = ref(null)

const history = useStorage("searchHistory", [])
const routes = [
  {
    name: "header.home",
    path: "/",
    icon: "material-symbols:house-rounded"
  },
  {
    name: "header.feed",
    path: "/feed",
    icon: "material-symbols:rss-feed-rounded"
  },
  {
    name: "discover.title",
    path: "/discover",
    icon: "material-symbols:explore-rounded"
  },
  {
    name: "header.table",
    path: "/table",
    icon: "material-symbols:backup-table-rounded"
  }
]

const searchResults = debounce(async () => {
  const data = await $fetch(`/api/search?q=${search.value}`)
  selectedIndex.value = 0
  loading.value = false
  if (data.status !== 200) {
    return
  }
  results.value = data.tmdb
  persons.value = data.persons
  users.value = data.users

  if (
    (data.tmdb.length > 0 || data.persons.length > 0 || data.users.length > 0) &&
    search.value.length > 0
  ) {
    history.value = [search.value, ...history.value].slice(0, 9)
    history.value = [...new Set(history.value)]
  }
}, 250)

const searchInput = (e) => {
  search.value = e.target.value
  loading.value = true
  searchResults()
}

const removeFocus = (bool = false) => {
  if (bool) {
    search.value = ""
    selectedIndex.value = 0
  }
  focused.value = false
  inputElement.value.blur()
}

const focus = () => {
  focused.value = true
  inputElement.value.focus()
}

const key = computed(() => {
  return isMacOS ? "⌘" : "Ctrl"
})

watch(focused, () => {
  $event("searchbar:focus", focused.value)
})

onKeyStroke(["Control", "Cmd", "K", "k"], (e) => {
  if (!isMacOS && (!e.ctrlKey || e.code !== "KeyK")) return
  if (isMacOS && (!e.metaKey || e.code !== "KeyK")) return
  e.preventDefault()
  if (focused.value) {
    removeFocus()
  } else {
    focus()
  }
})
</script>
<template>
  <div class="relative flex-grow transition-all md:max-w-lg">
    <Transition name="fade">
      <div
        v-show="focused"
        @click="removeFocus"
        class="fixed left-0 top-0 z-20 h-screen w-full bg-black/20 backdrop-blur"
      ></div>
    </Transition>

    <div class="relative z-20 h-10 w-full">
      <Icon
        name="material-symbols:search-rounded"
        class="pointer-events-none absolute left-3.5 top-[9px] h-6 w-6"
      />
      <div
        v-if="!focused"
        class="pointer-events-none absolute right-3.5 top-2 hidden select-none space-x-2 rounded border border-gray-500 px-1 py-0.5 text-center font-mono text-sm text-gray-400 lg:block"
      >
        {{ key }} K
      </div>
      <input
        type="text"
        class="h-full w-full rounded-full border-none bg-gray-950 pl-12 shadow placeholder:text-gray-300 hover:ring focus:outline-none focus:ring-0"
        :class="{
          'rounded-bl-none rounded-br-none rounded-tl-2xl rounded-tr-2xl focus:ring-0 hover:focus:ring-0':
            focused
        }"
        :placeholder="$t('search.text')"
        ref="inputElement"
        :value="search"
        @input="searchInput"
        @focusin="focused = true"
        @keydown.arrow-down="
          (e) => {
            e.preventDefault()
            if (search.length === 0) {
              if (history.length > 0) {
                selectedIndex =
                  selectedIndex < history.length + routes.length - 1
                    ? selectedIndex + 1
                    : selectedIndex
              } else {
                selectedIndex =
                  selectedIndex < routes.length - 1 ? selectedIndex + 1 : selectedIndex
              }
              return
            }
            selectedIndex =
              selectedIndex < results.length + persons.length + users.length - 1
                ? selectedIndex + 1
                : selectedIndex
          }
        "
        @keydown.arrow-up="
          (e) => {
            e.preventDefault()
            selectedIndex = selectedIndex > 0 ? selectedIndex - 1 : selectedIndex
          }
        "
        @keydown.enter="
          (e) => {
            e.preventDefault()
            if (loading) {
              return
            }

            if (search.length === 0) {
              if (history.length > 0 && selectedIndex < history.length) {
                search = history[selectedIndex]
                loading = true
                searchResults()
              } else {
                $router.push(routes[selectedIndex - history.length].path)
                removeFocus(true)
              }
              return
            } else if (selectedIndex < results.length) {
              $router.push($tlink(results[selectedIndex]))
            } else if (selectedIndex < results.length + persons.length) {
              $router.push($tlink({ type: 'person', ...persons[selectedIndex - results.length] }))
            } else if (selectedIndex < results.length + persons.length + users.length) {
              $router.push(`/${users[selectedIndex - results.length - persons.length].username}`)
            }
            selectedIndex = 0
            removeFocus(true)
          }
        "
        @keydown.esc="
          (e) => {
            e.preventDefault()
            removeFocus()
          }
        "
        @keydown.tab="
          (e) => {
            e.preventDefault()
            removeFocus()
          }
        "
      />
    </div>
    <div v-if="focused" class="absolute z-20 w-full rounded-bl-2xl rounded-br-2xl bg-gray-950 p-4">
      <div class="flex justify-center" v-if="loading">
        <Loader class="scale-75" />
      </div>
      <div
        v-else-if="
          results.length === 0 && users.length === 0 && persons.length === 0 && search.length !== 0
        "
      >
        <p class="text-center text-gray-300">
          {{ $t("search.no_results") }}
        </p>
      </div>
      <div v-else-if="search.length === 0" class="select-none space-y-2">
        <div v-for="(route, i) in routes" :key="route.name">
          <button
            tabindex="-1"
            @click="
              (e) => {
                $router.push(route.path)
                removeFocus(true)
              }
            "
            @mouseenter="selectedIndex = i + history.length"
            :data-index="i + history.length"
            :class="{
              'bg-gray-900': i + history.length === selectedIndex,
              'bg-gray-950': i + history.length !== selectedIndex
            }"
            class="inline-flex w-full items-center justify-between rounded-2xl px-2 py-1"
          >
            <span class="flex w-full cursor-pointer items-center opacity-80">
              <Icon :name="route.icon" class="mr-2 inline-block h-5 w-5" />
              {{ $t(route.name) }}
            </span>
          </button>
        </div>
      </div>
      <div v-else>
        <div v-if="results.length !== 0">
          <div class="mb-2 font-bold text-gray-300">
            {{ $t("search.movies_and_tv_shows") }}
          </div>

          <div v-for="(result, i) in results" :key="i">
            <NuxtLink
              :to="$tlink(result)"
              @mouseenter="selectedIndex = i"
              class="block w-full overflow-hidden rounded-lg p-1.5 transition-colors"
              @click="removeFocus(true)"
              :data-index="i"
              :class="{
                'bg-gray-900': i === selectedIndex,
                'bg-gray-950': i !== selectedIndex
              }"
            >
              <div class="flex w-full items-center">
                <img
                  v-if="result.poster_path"
                  :src="`https://image.tmdb.org/t/p/w200${result.poster_path}`"
                  class="h-auto w-10 rounded"
                />
                <div
                  v-else
                  class="flex h-14 w-10 items-center justify-center rounded bg-gray-700 font-semibold !text-white"
                >
                  X
                </div>
                <div class="ml-2 max-w-sm">
                  <p class="truncate text-ellipsis font-bold">
                    {{ $getTitle(result) }}
                  </p>
                  <p class="text-gray-300">
                    {{ (result.first_air_date || result.release_date || "-").split("-")[0] }}
                  </p>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
        <div v-if="persons.length !== 0">
          <div class="mb-2 font-bold text-gray-300">
            {{ $t("search.persons") }}
          </div>
          <div v-for="(person, i) in persons" :key="`person-${i}`">
            <NuxtLink
              :to="$tlink({ type: 'person', ...person })"
              @mouseenter="selectedIndex = i + results.length"
              @click="removeFocus(true)"
              class="block w-full overflow-hidden rounded-lg p-1.5 transition-colors"
              :data-index="i + results.length"
              :class="{
                'bg-gray-900': i + results.length === selectedIndex,
                'bg-gray-950': i + results.length !== selectedIndex
              }"
            >
              <div class="flex w-full items-center">
                <img
                  v-if="person.profile_path"
                  :src="`https://image.tmdb.org/t/p/w200${person.profile_path}`"
                  class="h-auto w-10 rounded"
                />
                <div
                  v-else
                  class="flex h-14 w-10 items-center justify-center rounded bg-gray-700 font-semibold !text-white"
                >
                  X
                </div>
                <div class="ml-2 max-w-sm">
                  <p class="truncate text-ellipsis font-bold">
                    {{ person.name }}
                  </p>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
        <div v-if="users.length !== 0">
          <div class="mb-2 font-bold text-gray-300">
            {{ $t("search.users") }}
          </div>
          <div v-for="(user, i) in users" :key="`user-${i}`">
            <NuxtLink
              :to="`/${user.username}`"
              @mouseenter="selectedIndex = i + results.length + persons.length"
              @click="removeFocus(true)"
              class="block w-full overflow-hidden rounded-lg p-1.5 transition-colors"
              :data-index="i + results.length"
              :class="{
                'bg-gray-900': i + (results.length + persons.length) === selectedIndex,
                'bg-gray-950': i + (results.length + persons.length) !== selectedIndex
              }"
            >
              <div class="flex w-full items-center">
                <Avatar :username="user.username" :avatar="user.avatar" class="h-10 w-10" />
                <div class="ml-2 flex max-w-sm items-center gap-x-1">
                  <p class="truncate text-ellipsis font-bold">
                    {{ user.display_name ?? user.username }}
                  </p>
                  <Icon
                    v-if="user.verified"
                    name="material-symbols:verified-rounded"
                    class="h-5 w-5 flex-shrink-0 text-brand"
                  />
                  <Logo
                    :small="true"
                    v-if="user.flags === 1"
                    class="h-4 w-4 flex-shrink-0 text-brand"
                  />
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
      <div
        class="bottom-2 left-2.5 mt-4 hidden w-fit select-none space-x-2 text-center font-mono text-sm text-gray-400 lg:block"
      >
        <i18n-t keypath="search.close" scope="global">
          <template v-slot:key>
            <span class="rounded border border-gray-500 px-1 py-0.5">Esc</span>
          </template>
        </i18n-t>
      </div>
    </div>
  </div>
</template>
