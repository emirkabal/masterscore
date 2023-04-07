<template>
  <NuxtLink
    to="/feed"
    class="group relative flex h-96 w-full flex-row-reverse items-center overflow-hidden rounded-lg bg-gradient-to-l from-black from-0% via-black via-40% to-100% py-4 after:absolute after:inset-0 after:left-full after:bg-gradient-to-l after:from-blue-500 after:from-0% after:via-blue-500 after:via-40% after:to-100% after:opacity-0 after:transition-all after:duration-500 after:hover:left-0 after:hover:opacity-100 dark:from-zinc-900 dark:via-zinc-900"
  >
    <img
      src="~/assets/images/feed.jpg"
      class="absolute top-0 -z-10 h-96 w-full object-cover object-left opacity-25 xl:opacity-100"
    />

    <div
      class="z-10 max-w-3xl px-4 text-center !text-white transition-all group-hover:!text-black md:px-16 md:text-right"
    >
      <h1 class="font-maven text-4xl font-bold">Looking for activities?</h1>
      <p class="text-lg leading-6 opacity-75">
        We are working on a feature like a Twitter feed to show you the latest
        activities of your friends and other users. Click the button below to
        learn more.
      </p>

      <div
        class="mx-auto mt-4 flex w-fit items-center gap-2 rounded border px-4 py-2 font-semibold transition-all group-hover:bg-white group-hover:text-black md:mx-0 md:ml-auto"
      >
        Take a look
        <IconsRightArrowSlim class="-mr-1 h-8 w-8" />
      </div>
    </div>
  </NuxtLink>
</template>
