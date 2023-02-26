<template>
  <div class="container mx-auto my-12 px-4">
    <HomeMostReviewedEntertainments />
    <!-- <HomeMostLikedEntertainments /> -->
    <div class="flex gap-12 w-full my-16 md:flex-row flex-col-reverse">
      <HomeLatestReviews class="flex-grow w-full" />
      <div class="flex flex-col gap-6">
        <HomeMostLikedEntertainment />
        <HomeViewScores />
        <HomeRandomMovie />
      </div>
    </div>
  </div>
</template>
