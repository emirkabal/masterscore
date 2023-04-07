<template>
  <NuxtLink
    to="/table"
    class="group relative flex h-96 w-full items-center overflow-hidden rounded-lg bg-gradient-to-r from-black from-0% via-black via-40% to-100% py-4 after:absolute after:inset-0 after:right-full after:bg-gradient-to-r after:from-yellow-500 after:from-0% after:via-yellow-500 after:via-40% after:to-100% after:opacity-0 after:transition-all after:duration-500 after:hover:right-0 after:hover:opacity-100 dark:from-zinc-900 dark:via-zinc-900"
  >
    <div
      class="z-10 max-w-3xl px-4 text-center !text-white transition-all group-hover:!text-black md:px-16 md:text-left"
    >
      <h1 class="font-maven text-4xl font-bold">
        <span class="text-yellow-500 group-hover:text-black">m</span>aster table
      </h1>
      <p class="text-lg leading-6 opacity-75">
        Master table is a feature that shows the top 100 movies and TV shows
        based on user reviews. The algorithm considers the quality and quantity
        of user reviews to determine the rankings. With filters for year, genre,
        and more, Master table helps users find high-quality movies and TV shows
        based on popular opinions.
      </p>

      <div
        class="mx-auto mt-4 flex w-fit items-center gap-2 rounded border px-4 py-2 font-semibold transition-all group-hover:bg-white group-hover:text-black md:mx-0"
      >
        Browse
        <IconsRightArrowSlim class="-mr-1 h-8 w-8" />
      </div>
    </div>
    <img
      src="~/assets/images/bg.jpg"
      class="absolute top-0 -z-10 h-96 w-full object-cover object-left-top opacity-50 xl:opacity-100"
    />
  </NuxtLink>
</template>
