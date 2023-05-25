import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthentication } from '../contexts/AuthenticationContext'

export function Signout() {
  const { logout } = useAuthentication()

  useEffect(() => {
    logout()
  }, [])

  return <Navigate to='/login' />
}
