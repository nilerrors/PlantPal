import { useState } from 'react'
import { Container, Form, Row, Col, Card, Button, Alert } from 'react-bootstrap'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuthentication } from '../contexts/AuthenticationContext'
import { useForm } from '../hooks/useForm'

export function EmailVerification() {
  document.title = 'Email Verification'
  document.body.style.background =
    'linear-gradient(to right, rgba(106, 17, 203, 1), rgba(37, 117, 252, 1))'

  const [verificationCode, setVerficationCode] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const navigate = useNavigate()

  const { useApi } = useAuthentication()

  const form = useForm(
    async () => {
      setLoading(true)
      try {
        const response = await useApi('/auth/user/resend_verification', {
          method: 'POST',
          body: form.values,
        })
        const data = await response.json()
        if (!response.ok) {
          setError(data.detail)
        } else {
          setMessage(data.message)
        }
        console.log(data)
      } catch (error: any) {
        setError(error?.message ?? error?.detail ?? 'Error')
      }
      setLoading(false)
    },
    { email: '' }
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
                <Form.Group className='mb-4 mx-5 w-100'>
                  <Form.Control
                    type='text'
                    placeholder='Verification Code'
                    className='bg-dark text-white'
                    size='lg'
                    name='verification-code'
                    onChange={(e) => setVerficationCode(e.target.value)}
                  />
                </Form.Group>
                <Button
                  className='mx-2 px-5'
                  color='white'
                  size='lg'
                  variant='secondary'
                  onClick={() => {
                    if (verificationCode.trim() == '') {
                      setError('No verification code given')
                      return
                    }
                    navigate(`/verify/${verificationCode}`)
                    return
                  }}
                >
                  {loading ? 'Loading...' : 'Verify'}
                </Button>
                <Form.Text>OR</Form.Text>
                {message == null ? (
                  <>
                    {error != null ? (
                      <Form.Text className='small mb-3 pb-lg-2 text-danger'>
                        {error}
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
                    <Button
                      type='submit'
                      className='mx-2 px-5'
                      color='white'
                      size='lg'
                      variant='secondary'
                    >
                      {loading ? 'Loading...' : 'Sign In'}
                    </Button>
                  </>
                ) : (
                  <Alert variant='success'>
                    {message}
                    <hr />
                    <Link to='/login'>Go to Login</Link>
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </Container>
  )
}
