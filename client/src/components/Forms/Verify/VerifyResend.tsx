import { useState } from 'react'
import {
  Container,
  Form,
  Row,
  Col,
  Card,
  Alert,
  Collapse,
  Button,
} from 'react-bootstrap'
import { useAuthentication } from '../../../contexts/AuthenticationContext'
import { useForm } from '../../../hooks/useForm'

type Props = {
  goBack: () => void
}

export function VerifyResend({ goBack }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const { useApi } = useAuthentication()

  const form = useForm(
    async () => {
      setLoading(true)
      try {
        const { res, data } = await useApi('/auth/user/resend_verification', {
          method: 'POST',
          body: form.values,
        })
        if (!res.ok) {
          setError(data.detail)
        } else {
          setMessage(data.message)
        }
      } catch (error: any) {
        setError(error?.message ?? error?.detail ?? 'Error')
      }
      setLoading(false)
    },
    { email: '' }
  )

  return (
    <>
      <Form onSubmit={form.onSubmit}>
        <Row className='d-flex justify-content-center align-items-center h-100'>
          <Col col='12'>
            <Button
              size='sm'
              variant='secondary'
              className='mt-2'
              onClick={goBack}
            >
              {'<'} Back
            </Button>
            <Card
              className='bg-dark text-white my-5 mx-auto'
              style={{ borderRadius: '1rem', maxWidth: '400px' }}
            >
              <Card.Body className='p-5 d-flex flex-column align-items-center mx-auto w-100'>
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
                      {loading ? 'Loading...' : 'Resend'}
                    </Button>
                  </>
                ) : (
                  <Alert variant='success'>
                    {message}
                    <Button onClick={goBack}>{'<'} Back</Button>
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </>
  )
}
