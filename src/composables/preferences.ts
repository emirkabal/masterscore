import { useLocalStorage } from "@vueuse/core"

export const usePreferences = () => {
  const preferences = useLocalStorage("preferences", {
    debug_mode: false,
    use_old_review_modal: false
  })
  return preferences
}
