import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { useAuthentication } from '../contexts/AuthenticationContext'

export function Settings() {
  const [user, setUser] = useState()

  const { useApi } = useAuthentication()

  useEffect(() => {
    useApi('/auth/user')
      .then((res) => res.json())
      .then((data) => setUser(data))
  }, [])

  return (
    <Container className='bg-dark text-align-center'>
      <h3>User Account</h3>
      <hr />
      <pre>{JSON.stringify(user, undefined, 2)}</pre>
    </Container>
  )
}
