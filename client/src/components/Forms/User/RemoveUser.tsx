import { useState } from 'react'
import { useAuthentication } from '../../../contexts/AuthenticationContext'
import { useForm } from '../../../hooks/useForm'
import { User } from '../../../types'
import { Form, Row, Card, Col } from 'react-bootstrap'
import { Button } from '../../Button'

type Props = {
  user: User
  closeForm: () => void
}

export function RemoveUser({ user, closeForm }: Props) {
  const [error, setError] = useState<null | string>(null)
  const { logout, getCurrentUser, useApi } = useAuthentication()

  const form = useForm(
    async () => {
      if (!confirm('Are you sure you want to delete your account?')) return
      const { res, data } = await useApi('/auth/user', {
        method: 'DELETE',
        body: {
          email: form.values.email,
          password: form.values.password,
        },
      })
      if (!res.ok) {
        setError(data?.detail ?? data?.message ?? 'Error')
        return
      }
      alert('Account Deleted')
      getCurrentUser()
      logout()
      closeForm()
    },
    {
      email: user.email,
      password: '',
    }
  )

  return (
    <Form onSubmit={form.onSubmit}>
      <Row className='d-flex justify-content-center align-items-center'>
        <Col col='12'>
          <Card
            className='bg-dark text-white my-5 mx-auto'
            style={{ borderRadius: '1rem', maxWidth: '700px' }}
          >
            {error != null ? (
              <Form.Text className='small mb-3 pb-lg-2 text-success'>
                {error}
              </Form.Text>
            ) : null}
            <Card.Body className='p-5 d-flex flex-column align-items-center mx-auto w-100'>
              <Form.Group className='mb-4 mx-5 w-100'>
                <Form.Control
                  type='password'
                  className='bg-dark text-white'
                  placeholder='Password'
                  size='lg'
                  name='password'
                  required={true}
                  value={form.values?.password}
                  onChange={form.onChange}
                />
              </Form.Group>
              <Button
                type='submit'
                className='mx-2 px-5'
                color='white'
                size='lg'
                variant='primary'
              >
                {form.loading ? 'Loading...' : 'Change'}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Form>
  )
}
