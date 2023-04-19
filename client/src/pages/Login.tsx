import { Link, useNavigate } from 'react-router-dom'
import { Container, Form, Row, Col, Card } from 'react-bootstrap'
import { Button } from '../components/Button'
import { useAuthentication } from '../contexts/AuthenticationContext'
import { useState } from 'react'
import { useForm } from '../hooks/useForm'
import { validate as validateEmail } from 'email-validator'

type LoginFormValues = {
  email: string
  password: string
  remember: boolean
}

export function Login() {
  document.title = 'Login'
  document.body.style.background =
    'linear-gradient(to right, rgba(106, 17, 203, 1), rgba(37, 117, 252, 1))'

  const { login, useApi } = useAuthentication()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const form = useForm<LoginFormValues>(
    async () => {
      setLoading(true)

      // Validation
      if (!validateEmail(form.values.email)) {
        setError('Email is not valid')
      } else if (form.values.password.length < 8) {
        setError('Password must be at least 8 characters long')
      } else {
        try {
          const { res, data } = await useApi('/auth/login', {
            method: 'POST',
            body: form.values,
          })
          if (!res.ok) {
            setError(data.detail)
          } else {
            login(data?.access_token ?? '')
            navigate(0)
          }
        } catch (error: any) {
          setError(error?.message ?? error?.detail ?? 'Error')
        }
      }

      setLoading(false)
    },
    {
      email: '',
      password: '',
      remember: true,
    }
  )

  return (
    <Container fluid className='user-select-none'>
      <Form onSubmit={form.onSubmit}>
        <Row className='d-flex justify-content-center align-items-center h-100'>
          <Col col='12'>
            <Card
              className='bg-dark text-white my-5 mx-auto'
              style={{ borderRadius: '1rem', maxWidth: '400px' }}
            >
              <Card.Body className='p-5 d-flex flex-column align-items-center mx-auto w-100'>
                {error != null ? (
                  <Form.Text className='small mb-3 pb-lg-2 text-danger'>
                    {error}{' '}
                    {error === 'Account is not verified' ? (
                      <Link to='/verify' className='text-white-50 fw-bold'>
                        Resend Verification
                      </Link>
                    ) : null}
                  </Form.Text>
                ) : null}
                <Form.Group className='mb-4 mx-5 w-100'>
                  <Form.Control
                    type='email'
                    placeholder='Email'
                    className='bg-dark text-white'
                    size='lg'
                    name='email'
                    required={true}
                    onChange={form.onChange}
                  />
                </Form.Group>
                <Form.Group className='mb-4 mx-5 w-100'>
                  <Form.Control
                    type='password'
                    placeholder='Password'
                    className='bg-dark text-white'
                    size='lg'
                    name='password'
                    required={true}
                    onChange={form.onChange}
                  />
                </Form.Group>
                <Form.Text className='small mb-3 pb-lg-2'>
                  <Link to='/forgot-password' className='text-white-50'>
                    Forgot Password?
                  </Link>
                </Form.Text>
                <Form.Group className='d-flex flex-row justify-content-center mb-4'>
                  <Form.Check
                    label='Remeber Me'
                    name='remember'
                    checked={form.values.remember}
                    onChange={form.onChange}
                  />
                </Form.Group>
                <Button
                  type='submit'
                  className='mx-2 px-5'
                  color='white'
                  size='lg'
                  variant='secondary'
                >
                  {loading ? 'Loading...' : 'Sign In'}
                </Button>
                <hr />
                <Form.Text className='mb-0'>
                  Don't have an account?{' '}
                  <Link to='/signup' className='text-white-50 fw-bold'>
                    Sign Up
                  </Link>
                </Form.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </Container>
  )
}
