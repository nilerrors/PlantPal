import { Routes, Route, Navigate } from 'react-router-dom'
import { NavBar } from './components/NavBar'
import { useAuthentication } from './contexts/AuthenticationContext'
import { EmailVerification } from './pages/EmailVerification'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Plant } from './pages/Plant'
import { Plants } from './pages/Plants'
import { PlantsAdd } from './pages/PlantsAdd'
import { Signout } from './pages/Signout'
import { Signup } from './pages/Signup'
import { VerifyEmail } from './pages/VerifyEmail'

function App() {
  document.title = 'Management'

  const { loggedin, logout } = useAuthentication()

  console.log(loggedin)

  return (
    <>
      {!loggedin ? (
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/verify' element={<EmailVerification />} />
          <Route path='/verify/:id' element={<VerifyEmail />} />
          <Route path='*' element={<Navigate to='/login' />} />
        </Routes>
      ) : (
        <>
          <NavBar />
          <main className='bg-dark text-white position-absolute p-0 m-0'>
            <Routes>
              <Route index element={<Home />} />
              <Route path='/plants' element={<Plants />} />
              <Route path='/plants/add' element={<PlantsAdd />} />
              <Route path='/plants/:id' element={<Plant />} />
              <Route path='/settings' element={<p>Hello Settings</p>} />
              <Route path='/signout' element={<Signout />} />
              <Route path='*' element={<Navigate to='/' />} />
            </Routes>
          </main>
        </>
      )}
    </>
  )
}

export default App
