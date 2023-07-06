<script setup>
import debounce from "lodash.debounce"
import { onKeyStroke, useStorage } from "@vueuse/core"
import IconHome from "~/components/icons/Home.vue"
import IconFeed from "~/components/icons/Feed.vue"
import IconStar from "~/components/icons/Star.vue"
import IconDice from "~/components/icons/Dice.vue"

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
    name: "Home",
    path: "/",
    icon: IconHome
  },
  {
    name: "Feed",
    path: "/feed",
    icon: IconFeed
  },
  {
    name: "Table",
    path: "/table",
    icon: IconStar
  },
  {
    name: "Random Movie",
    path: "/random",
    icon: IconDice
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
    (data.tmdb.length > 0 ||
      data.persons.length > 0 ||
      data.users.length > 0) &&
    search.value.length > 0
  ) {
    history.value = [search.value, ...history.value].slice(0, 9)
    history.value = [...new Set(history.value)]
  }
}, 500)

const removeHistoryItem = (index) => {
  history.value.splice(index, 1)
}

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

onKeyStroke(["Control", "K", "k"], (e) => {
  if (!e.ctrlKey || e.code !== "KeyK") return
  e.preventDefault()
  if (focused.value) {
    removeFocus()
  } else {
    focus()
  }
})
</script>
<template>
  <div class="relative max-w-lg flex-grow">
    <Transition name="fade">
      <div
        v-show="focused"
        @click="removeFocus"
        class="fixed left-0 top-0 z-20 h-screen w-full bg-black/20 backdrop-blur"
      ></div>
    </Transition>

    <div class="relative z-20 w-full">
      <IconsSearch class="pointer-events-none absolute left-2 top-[9px]" />
      <div
        v-if="!focused"
        class="pointer-events-none absolute right-2.5 top-2 hidden select-none space-x-2 rounded border border-gray-500 px-1 py-0.5 text-center font-mono text-sm text-gray-800 dark:text-gray-400 lg:block"
      >
        Ctrl K
      </div>
      <input
        type="text"
        class="hover:foucs:ring-0 w-full rounded-lg border-none bg-white pl-10 shadow focus:ring-0 hover:ring dark:bg-black dark:placeholder:text-gray-300"
        :class="{
          'rounded-bl-none rounded-br-none rounded-tl-2xl rounded-tr-2xl focus:ring-0 hover:focus:ring-0':
            focused
        }"
        :placeholder="
          focused ? 'Type to search...' : 'Type to search... (new update here)'
        "
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
                  selectedIndex < routes.length - 1
                    ? selectedIndex + 1
                    : selectedIndex
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
                    .username
                }`
              )
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
    <div
      v-if="focused"
      class="absolute z-20 w-full rounded-bl-2xl rounded-br-2xl bg-white p-4 dark:bg-black"
    >
      <div class="flex justify-center" v-if="loading">
        <Spinner color="#000" />
      </div>
      <div
        v-else-if="
          results.length === 0 &&
          users.length === 0 &&
          persons.length === 0 &&
          search.length !== 0
        "
      >
        <p class="text-center text-gray-500 dark:text-gray-300">
          No results found
        </p>
      </div>
      <div v-else-if="search.length === 0" class="space-y-2">
        <div v-if="history.length === 0">
          <p class="text-center text-gray-500 dark:text-gray-300">
            No recent searches
          </p>
        </div>
        <div v-else>
          <div v-for="(item, i) in history" :key="'history-' + i">
            <a
              tabindex="-1"
              @click="
                (e) => {
                  search = item
                  loading = true
                  searchResults()
                }
              "
              @mouseenter="selectedIndex = i"
              :data-index="i"
              :class="{
                'bg-gray-100 dark:bg-zinc-900': i === selectedIndex,
                'bg-white dark:bg-black': i !== selectedIndex
              }"
              class="flex items-center justify-between rounded-2xl px-2 py-1"
            >
              <span class="flex w-full cursor-pointer items-center opacity-80">
                <IconsHistory class="mr-2 inline-block h-5 w-5" />
                {{ item }}
              </span>
              <IconsTimes
                class="ml-2 inline-block cursor-pointer text-gray-500 transition-colors hover:text-red-500 dark:text-gray-300 dark:hover:text-red-500"
                @click="
                  (e) => {
                    e.stopPropagation()
                    removeHistoryItem(i)
                  }
                "
              />
            </a>
          </div>
        </div>

        <hr class="dark:opacity-25" />
        <div v-for="(route, i) in routes" :key="route.name">
          <a
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
              'bg-gray-100 dark:bg-zinc-900':
                i + history.length === selectedIndex,
              'bg-white dark:bg-black': i + history.length !== selectedIndex
            }"
            class="flex items-center justify-between rounded-2xl px-2 py-1"
          >
            <span class="flex w-full cursor-pointer items-center opacity-80">
              <component
                :is="route.icon"
                class="mr-2 inline-block h-5 w-5"
                :class="{
                  'fill-black dark:fill-white':
                    i + history.length === selectedIndex ||
                    route.path === $route.path
                }"
              />
              {{ route.name }}
            </span>
          </a>
        </div>
      </div>
      <div v-else>
        <div v-if="results.length !== 0">
          <div class="mb-2 font-bold text-gray-500 dark:text-gray-300">
            Movies & TV Shows
          </div>

          <div v-for="(result, i) in results" :key="i">
            <NuxtLink
              :to="`/details/${result.media_type}/${result.id}`"
              @mouseenter="selectedIndex = i"
              class="block w-full overflow-hidden rounded-lg p-1.5 transition-colors"
              @click="removeFocus(true)"
              :data-index="i"
              :class="{
                'bg-gray-100 dark:bg-zinc-900': i === selectedIndex,
                'bg-white dark:bg-black': i !== selectedIndex
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
            </NuxtLink>
          </div>
        </div>
        <div v-if="persons.length !== 0">
          <div class="mb-2 font-bold text-gray-500 dark:text-gray-300">
            Persons
          </div>
          <div v-for="(person, i) in persons" :key="`person-${i}`">
            <NuxtLink
              :to="`/details/person/${person.id}`"
              @mouseenter="selectedIndex = i + results.length"
              @click="removeFocus(true)"
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
          <div class="mb-2 font-bold text-gray-500 dark:text-gray-300">
            Users
          </div>
          <div v-for="(user, i) in users" :key="`user-${i}`">
            <NuxtLink
              :to="`/users/@${user.username}`"
              @mouseenter="selectedIndex = i + results.length + persons.length"
              @click="removeFocus(true)"
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
                <Avatar
                  :username="user.username"
                  :avatar="user.avatar"
                  class="h-10 w-10"
                  :border="true"
                />
                <div class="ml-2 max-w-sm">
                  <p class="truncate text-ellipsis font-bold">
                    @{{ user.username }}
                  </p>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
      <div
        class="bottom-2 left-2.5 mt-4 hidden w-fit select-none space-x-2 text-center font-mono text-sm text-gray-800 dark:text-gray-400 lg:block"
      >
        <span class="rounded border border-gray-500 px-1 py-0.5">Esc</span>
        <span>to close</span>
      </div>
    </div>
  </div>
</template>
