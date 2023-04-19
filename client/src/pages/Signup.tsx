import { Link } from 'react-router-dom'
import { Container, Form, Row, Col, Card } from 'react-bootstrap'
import { Button } from '../components/Button'
import { useAuthentication } from '../contexts/AuthenticationContext'
import { useState } from 'react'
import { useForm } from '../hooks/useForm'
import { validate as validateEmail } from 'email-validator'

export function Signup() {
  document.title = 'Signup'
  document.body.style.background =
    'linear-gradient(to right, rgba(106, 17, 203, 1), rgba(37, 117, 252, 1))'

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const { useApi } = useAuthentication()

  const form = useForm(
    async () => {
      setLoading(true)

      // Validation
      if (!validateEmail(form.values.email)) {
        setError('E-mail must be valid')
      } else if (form.values.password.length < 8) {
        setError('Password must be at least 8 characters long')
      } else {
        try {
          const { res, data } = await useApi('/auth/signup', {
            method: 'POST',
            body: {
              first_name: form.values.firstName,
              last_name: form.values.lastName,
              email: form.values.email,
              password: form.values.password,
            },
          })
          if (!res.ok) {
            setError(data?.detail ?? data?.message ?? 'Error')
          } else {
            setMessage(data?.message ?? data?.detail ?? '')
          }
        } catch (error: any) {
          setError(error?.message ?? error?.detail ?? 'Error')
        }
      }

      setLoading(false)
    },
    {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
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
                {message != null ? (
                  <>
                    <Form.Text className='small mb-3 pb-lg-2 text-success'>
                      {message}
                    </Form.Text>
                    <hr />
                    <Form.Text className='mb-0'>
                      <Link to='/verify' className='text-white-50 fw-bold'>
                        Go to Verification Form
                      </Link>
                    </Form.Text>
                  </>
                ) : (
                  <>
                    {error != null && (
                      <Form.Text className='small mb-3 pb-lg-2 text-danger'>
                        {error}
                      </Form.Text>
                    )}
                    <Form.Group className='mb-4 mx-5 w-100'>
                      <Form.Control
                        type='text'
                        placeholder='First Name'
                        className='bg-dark text-white'
                        size='lg'
                        name='firstName'
                        required={true}
                        onChange={form.onChange}
                      />
                    </Form.Group>
                    <Form.Group className='mb-4 mx-5 w-100'>
                      <Form.Control
                        type='text'
                        placeholder='Last Name'
                        className='bg-dark text-white'
                        size='lg'
                        name='lastName'
                        required={true}
                        onChange={form.onChange}
                      />
                    </Form.Group>
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
                    <Button
                      type='submit'
                      className='mx-2 px-5'
                      color='white'
                      size='lg'
                      variant='secondary'
                    >
                      {loading ? 'Loading...' : 'Sign Up'}
                    </Button>
                    <hr />
                    <Form.Text className='mb-0'>
                      Already have an account?{' '}
                      <Link to='/login' className='text-white-50 fw-bold'>
                        Sign In
                      </Link>
                    </Form.Text>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </Container>
  )
}
