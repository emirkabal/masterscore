import { I18nOptions } from '@nuxtjs/i18n'


export default {
  defaultLocale: 'en',
  fallbackLocale: 'en',
  locales: [
    {
      code: 'en',
      name: 'English',
      iso: 'en-US',
      file: 'en-US.json'
    },
    {
      code: 'tr',
      name: 'Türkçe',
      iso: 'tr-TR',
      file: 'tr-TR.json'
    }
  ],
  lazy: true,
  langDir: 'locales',
  detectBrowserLanguage: {
    useCookie: true,
    alwaysRedirect: true,
    cookieKey: 'locale',
    redirectOn: 'root'
  }
} as I18nOptions