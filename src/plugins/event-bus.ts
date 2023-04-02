import mitt from "mitt"

type ApplicationEvents = {
  "user:init": boolean
  "modal:trailer": boolean
  "modal:review": boolean
  "entertainment:bright": boolean
  "entertainment:load": boolean
  "entertainment:fetch:reviews": boolean
  "entertainment:fetch:likes": boolean
}

export default defineNuxtPlugin(() => {
  const emitter = mitt<ApplicationEvents>()

  return {
    provide: {
      event: emitter.emit, // Will emit an event
      listen: emitter.on // Will register a listener for an event
    }
  }
})
