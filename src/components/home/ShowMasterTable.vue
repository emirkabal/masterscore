<template>
  <NuxtLink to="/table"
    class="w-full after:bg-gradient-to-r bg-gradient-to-r dark:from-zinc-900 dark:via-zinc-900 from-black from-0% after:from-0% via-black after:via-40% via-40% after:to-100% to-100% flex items-center py-4 rounded-lg h-96 overflow-hidden relative group after:from-yellow-500 after:via-yellow-500 after:opacity-0 after:hover:opacity-100 after:right-full after:hover:right-0 after:transition-all after:duration-500 after:absolute after:inset-0">
    <div
      class=" !text-white group-hover:!text-black max-w-3xl md:px-16 px-4 text-center md:text-left z-10 transition-all">
      <h1 class="text-4xl font-bold font-maven"><span class="text-yellow-500 group-hover:text-black">m</span>aster
        table</h1>
      <p class="text-lg leading-6 opacity-75">
        Master table is a feature that shows the top 100 movies and TV shows based on user reviews. The algorithm
        considers the quality and quantity of user reviews to determine the rankings. With filters for year, genre, and
        more, Master table helps users find high-quality movies and TV shows based on popular opinions.
      </p>

      <div
        class="flex w-fit items-center mx-auto md:mx-0 gap-2 border px-4 py-2 rounded mt-4 group-hover:text-black group-hover:bg-white font-semibold transition-all">
        Browse
        <IconsRightArrowSlim class="h-8 w-8 -mr-1" />
      </div>
    </div>
    <img src="~/assets/images/bg.jpg"
      class="absolute w-full object-left-top object-cover h-96 top-0 -z-10 opacity-50 xl:opacity-100">
  </NuxtLink>
</template>
