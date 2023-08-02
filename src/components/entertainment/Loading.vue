<template>
  <div>
    <EntertainmentContainer :loading="true">
      <EntertainmentPoster :loading="true" />
      <div class="w-full max-w-2xl">
        <EntertainmentBody :loading="true" />
        <EntertainmentButtonGroup :loading="true" />
      </div>
    </EntertainmentContainer>

    <div class="container mx-auto mb-28 mt-8 px-4">
      <div class="flex flex-col-reverse items-stretch gap-4 lg:flex-row">
        <div class="relative min-w-0 flex-1 space-y-10 lg:space-y-16">
          <EntertainmentDetailsCast :loading="true" />
          <EntertainmentDetailsReviews :loading="true" />
        </div>
        <div
          class="static top-14 w-full self-start lg:sticky lg:min-w-[300px] lg:max-w-[300px]"
        >
          <div class="mt-12">
            <Spinner />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
