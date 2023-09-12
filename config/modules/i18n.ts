export default {
  strategy: 'no_prefix',
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
      code: 'de',
      name: 'Deutsch',
      iso: 'de-DE',
      file: 'de-DE.json'
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
    fallbackLocale: 'en',
    redirectOn: 'all'
  }
}