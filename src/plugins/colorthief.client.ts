import { FastAverageColor } from "fast-average-color"

export default defineNuxtPlugin(() => {
  const colorthief = new FastAverageColor()

  return {
    provide: {
      colorthief
    }
  }
})
