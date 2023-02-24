<template>
  <div class="container m-auto my-12">
    <HomeMostReviewedEntertainments />
    <!-- <HomeMostLikedEntertainments /> -->
    <div class="flex gap-12 w-full my-16">
      <HomeLatestReviews class="flex-grow w-full" />
      <div class="flex flex-col gap-6">
        <HomeMostLikedEntertainment />
        <HomeViewScores />
        <HomeRandomMovie />
      </div>
    </div>
  </div>
</template>
