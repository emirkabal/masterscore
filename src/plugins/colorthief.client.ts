import { FastAverageColor } from "fast-average-color"

declare module "#app" {
  interface NuxtApp {
    $colorthief: FastAverageColor
  }
}

export default defineNuxtPlugin(() => {
  const colorthief = new FastAverageColor()

  return {
    provide: {
      colorthief
    }
  }
})
