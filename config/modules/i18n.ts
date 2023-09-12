export default {
  strategy: 'no_prefix',
  defaultLocale: 'en',
  fallbackLocale: 'en',
  locales: [
    {
      code: 'en',
      name: 'English',
      iso: 'en-US',
      flag: 'gb',
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
    },
    {
      code: 'fr',
      name: 'Français',
      iso: 'fr-FR',
      file: 'fr-FR.json'
    },
    {
      code: 'es',
      name: 'Español',
      iso: 'es-ES',
      file: 'es-ES.json'
    },
    {
      code: 'ru',
      name: 'Русский',
      iso: 'ru-RU',
      file: 'ru-RU.json'
    },
    {
      code: 'sv',
      name: 'Svenska',
      iso: 'sv-SE',
      flag: 'se',
      file: 'sv-SE.json'
    },
    {
      code: 'hi',
      name: 'हिन्दी',
      iso: 'hi-IN',
      flag: 'in',
      file: 'hi-IN.json'
    },
    {
      code: 'pt',
      name: 'Português',
      iso: 'pt-PT',
      file: 'pt-PT.json'
    },
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