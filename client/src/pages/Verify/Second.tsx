import { useState } from 'react'
import { Container, Form, Row, Col, Card, Alert } from 'react-bootstrap'
import { Button } from '../../components/Button'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useAuthentication } from '../../contexts/AuthenticationContext'
import { useForm } from '../../hooks/useForm'

export function VerifySecond() {
  document.title = 'Email Verification'
  document.body.style.background =
    'linear-gradient(to right, rgba(106, 17, 203, 1), rgba(37, 117, 252, 1))'

  const { id } = useParams()

  if (id == undefined) {
    return <Navigate to='/verify' />
  }

  const [loading, setLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  function isAlphaNumeric(str: string) {
    var code, i, len

    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i)
      if (!(code > 47 && code < 58) && !(code > 96 && code < 123)) {
        return false
      }
    }
    return true
  }

  const { useApi, login } = useAuthentication()

  const form = useForm(
    () => {
      setLoading(true)
      useApi(`/auth/user/verify/${id}/${form.values.code}`, { method: 'POST' })
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
    },
    { code: '' }
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
                  <Form.Text
                    className={
                      'small mb-3 pb-lg-2 ' + isError ? 'text-danger' : ''
                    }
                  >
                    {message}
                  </Form.Text>
                ) : null}
                <Form.Group className='mb-4 mx-5 w-100'>
                  <Form.Control
                    type='text'
                    placeholder='Verification Code'
                    className='bg-dark text-white'
                    size='lg'
                    name='code'
                    required={true}
                    value={form.values.code}
                    // onChange={form.onChange}
                    onInput={(e) => {
                      setIsError(false)
                      setMessage(null)
                      form.set({
                        code: e.currentTarget.value
                          .split('')
                          .filter((c) => {
                            if (!isAlphaNumeric(c)) {
                              setIsError(true)
                              setMessage(
                                'Only lowercase letters and numbers are allowed'
                              )
                              return false
                            }
                            return true
                          })
                          .join(''),
                      })
                    }}
                  />
                </Form.Group>
                <Button
                  type='submit'
                  className='mx-2 px-5'
                  color='white'
                  size='lg'
                  variant='secondary'
                  required={true}
                >
                  {loading ? 'Loading...' : 'Verify'}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </Container>
  )
}
