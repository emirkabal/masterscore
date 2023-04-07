<template>
  <NuxtLink to="/feed"
    class="w-full after:bg-gradient-to-l bg-gradient-to-l dark:from-zinc-900 dark:via-zinc-900 from-black from-0% after:from-0% via-black after:via-40% via-40% after:to-100% to-100% flex flex-row-reverse items-center py-4 rounded-lg h-96 overflow-hidden relative group after:from-blue-500 after:via-blue-500 after:opacity-0 after:hover:opacity-100 after:left-full after:hover:left-0 after:transition-all after:duration-500 after:absolute after:inset-0">

    <img src="~/assets/images/feed.jpg"
      class="absolute w-full object-left object-cover h-96 top-0 -z-10 opacity-25 xl:opacity-100">

    <div
      class=" !text-white group-hover:!text-black max-w-3xl md:px-16 px-4 text-center md:text-right z-10 transition-all">
      <h1 class="text-4xl font-bold font-maven">Looking for activities?</h1>
      <p class="text-lg leading-6 opacity-75">
        We are working on a feature like a Twitter feed to show you the latest activities of your friends and other users.
        Click the button below to learn more.
      </p>

      <div
        class="flex w-fit items-center mx-auto md:mx-0 md:ml-auto gap-2 border px-4 py-2 rounded mt-4 group-hover:text-black group-hover:bg-white font-semibold transition-all">
        Take a look
        <IconsRightArrowSlim class="h-8 w-8 -mr-1" />
      </div>
    </div>
  </NuxtLink>
</template>
