import cfg from "~~/config/modules/i18n"

export default (locale: string | null | undefined) => {
  // @ts-ignore
  return locale ? cfg.locales.find((l) => l.code === locale)?.iso || "en-US" : "en-US"
}
