<template>
  <div class="container mx-auto my-12 px-4">
    <HomeTrending />
    <HomeMostReviewedEntertainments />
    <!-- <HomeMostLikedEntertainments /> -->
    <div class="my-16 flex w-full flex-col-reverse gap-12 md:flex-row">
      <HomeLatestReviews class="w-full flex-grow" />
      <div class="flex flex-col gap-6">
        <HomeMostLikedEntertainment />
        <HomeViewScores />
        <HomeRandomMovie />
      </div>
    </div>
  </div>
</template>
