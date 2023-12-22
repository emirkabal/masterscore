import mitt from "mitt"

export type ApplicationEvents = {
  "user:init": boolean
  "modal:trailer": boolean
  "modal:review": boolean
  "entertainment:bright": boolean
  "entertainment:load": boolean
  "entertainment:fetch:reviews": boolean
  "entertainment:fetch:likes": boolean
  "entertainment:handle:button": "like" | "watchlist" | "review" | ["watch", string | number]
  "entertainment:watch": [
    string,
    {
      episode_number: string | number
      season_number: string | number
    }
  ]
  "entertainment:watch-feature-mismatch": void
  "refresh:entertainment": void
  "searchbar:focus": boolean
  "core:player": {
    time?: number
    paused?: boolean
  }
}

export default defineNuxtPlugin(() => {
  const emitter = mitt<ApplicationEvents>()

  return {
    provide: {
      event: emitter.emit, // Will emit an event
      listen: emitter.on, // Will register a listener for an event,
      dispatch: emitter.off
    }
  }
})
