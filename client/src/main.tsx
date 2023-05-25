import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import './custom.css'
import { AuthenticationContextProvider } from './contexts/AuthenticationContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Suspense fallback={<p className='text-white'>Loading...</p>}>
      <AuthenticationContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthenticationContextProvider>
    </Suspense>
  </React.StrictMode>
)
