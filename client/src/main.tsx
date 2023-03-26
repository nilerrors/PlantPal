import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'

import './custom.css'
import { AuthenticationContextProvider } from './contexts/AuthenticationContext'
import { PlantsCollectionsContextProvider } from './contexts/PlantsCollectionsContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Suspense fallback={<p className='text-white'>Loading...</p>}>
      <AuthenticationContextProvider>
        <PlantsCollectionsContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </PlantsCollectionsContextProvider>
      </AuthenticationContextProvider>
    </Suspense>
  </React.StrictMode>
)
