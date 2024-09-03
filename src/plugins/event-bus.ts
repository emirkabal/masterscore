import mitt from "mitt"

export type ApplicationEvents = {
  "user:init": boolean
  "modal:trailer": boolean
  "modal:review": boolean
  "entertainment:bright": boolean
  "entertainment:load": boolean
  "entertainment:fetch:reviews": boolean
  "entertainment:fetch:likes": boolean
  "entertainment:handle:button": "like" | "review"
  "refresh:entertainment": void
  "searchbar:focus": boolean
  "core:player": {
    time?: number
    paused?: boolean
  }
}

interface IEventBus {
  event: (event: keyof ApplicationEvents, ...args: any[]) => void
  listen: (event: keyof ApplicationEvents, callback: (...args: any[]) => void) => void
  dispatch: (event: keyof ApplicationEvents, ...args: any[]) => void
}

declare module "#app" {
  interface NuxtApp {
    $event: IEventBus["event"]
    $listen: IEventBus["listen"]
    $dispatch: IEventBus["dispatch"]
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
