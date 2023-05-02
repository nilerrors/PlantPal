import { Routes, Route, Navigate } from 'react-router-dom'
import { NavBar } from './components/NavBar'
import { useAuthentication } from './contexts/AuthenticationContext'
import { EmailVerification } from './pages/EmailVerification'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Plant } from './pages/Plant'
import { Plants } from './pages/Plants'
import { Settings } from './pages/Settings'
import { SetupTutorial } from './pages/SetupTutorial'
import { Signout } from './pages/Signout'
import { Signup } from './pages/Signup'
import { Timestamps } from './pages/Timestamps'
import { VerifyEmail } from './pages/VerifyEmail'
import { Periodstamps } from './pages/Periodstamps'

function App() {
  document.title = 'PlantPal'

  const { loggedin } = useAuthentication()

  if (!loggedin) {
    return (
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/verify' element={<EmailVerification />} />
        <Route path='/verify/:id' element={<VerifyEmail />} />
        <Route path='*' element={<Navigate to='/login' />} />
      </Routes>
    )
  }

  return (
    <>
      <NavBar />
      <main className='bg-dark text-white position-absolute p-0 m-0'>
        <Routes>
          <Route index element={<Home />} />
          <Route path='/tutorial' element={<SetupTutorial />} />
          <Route path='/plants' element={<Plants />} />
          <Route path='/plants/:id' element={<Plant />} />
          <Route path='/plants/:id/timestamps' element={<Timestamps />} />
          <Route path='/plants/:id/periodstamps' element={<Periodstamps />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/signout' element={<Signout />} />
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
        <footer className='fixed-bottom mb-0 mx-3'>
          <p className='text-white' style={{ float: 'right', fontSize: 10 }}>
            by <a href='https://github.com/nilerrors'>nilerrors</a>
          </p>
        </footer>
      </main>
    </>
  )
}

export default App
