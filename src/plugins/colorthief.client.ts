import ColorThief from "colorthief"

export default defineNuxtPlugin(() => {
  const colorthief = new ColorThief()

  return {
    provide: {
      colorthief
    }
  }
})
