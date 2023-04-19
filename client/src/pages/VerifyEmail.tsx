import { useEffect, useState } from 'react'
import { Alert, Badge, Container } from 'react-bootstrap'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useAuthentication } from '../contexts/AuthenticationContext'

export function VerifyEmail() {
  document.title = 'Email Verification'
  document.body.style.background =
    'linear-gradient(to right, rgba(106, 17, 203, 1), rgba(37, 117, 252, 1))'

  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [message, setMessage] = useState('')

  const { useApi, login } = useAuthentication()

  if (id == undefined) {
    return <Navigate to='/' />
  }

  useEffect(() => {
    setLoading(true)
    useApi(`/auth/user/verify/${id}`, { method: 'POST' })
      .then(({ res, data }) => {
        setIsError(!res.ok)
        return data
      })
      .then((data) => {
        if (data?.access_token !== undefined) {
          login(data?.access_token)
          return <Navigate to='/' />
        }
        setMessage(data?.detail ?? data?.message ?? '')
      })
      .catch((error) => {
        setMessage(error.message)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <Container className='d-flex text-align-center justify-content-center align-items-center h-100'>
      {loading ? (
        <Badge bg='secondary'>Loading...</Badge>
      ) : (
        <Alert variant={isError ? 'danger' : 'success'}>
          {message}
          <hr />
          <Link to='/login'>Go to Login</Link>
        </Alert>
      )}
    </Container>
  )
}
