// src/i18n.js

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ruTranslation from './ru.json'
import uzTranslation from './uz.json' // Translation resources

// Translation resources
const resources = {
  uz: {
    translation: uzTranslation,
  },
  ru: {
    translation: ruTranslation,
  },
}
// Initialization of i18n
i18n
  .use(initReactI18next) // Passes i18n instance to react-i18next.
  .init({
    fallbackLng: 'ru', // Default language when the selected one is not available
    lng: 'ru', // Initial language
    resources: resources,
    debug: false, // Enable debug logs (can be useful for development)
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
  })
  .then()

export default i18n
