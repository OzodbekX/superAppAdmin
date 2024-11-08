/**
 =========================================================
 * Material Tailwind Dashboard React - v2.1.0
 =========================================================
 * Product Page: https://www.creative-tim.com/product/material-tailwind-dashboard-react
 * Copyright 2023 Creative Tim (https://www.creative-tim.com)
 * Licensed under MIT (https://github.com/creativetimofficial/material-tailwind-dashboard-react/blob/main/LICENSE.md)
 * Coded by Creative Tim
 =========================================================
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@material-tailwind/react'
import { MaterialTailwindControllerProvider } from '@/context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import i18n from './locales/i18n.js' // Import the i18n configuration
import '../public/css/tailwind.css'
import { I18nextProvider } from 'react-i18next'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <MaterialTailwindControllerProvider>
          <QueryClientProvider client={queryClient}>
            <I18nextProvider i18n={i18n} defaultNS={'translation'}>
              <App />
            </I18nextProvider>
          </QueryClientProvider>
        </MaterialTailwindControllerProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
