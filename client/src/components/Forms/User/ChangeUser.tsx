import { useForm } from '../../../hooks/useForm'
import { Form, Row, Card, Col } from 'react-bootstrap'
import { Button } from '../../Button'
import { User } from '../../../types'
import { useAuthentication } from '../../../contexts/AuthenticationContext'
import { useState } from 'react'

type Props = {
  user: User
  closeForm: () => void
}

export function ChangeUser({ user, closeForm }: Props) {
  const [error, setError] = useState<null | string>(null)
  const { login, getCurrentUser, useApi } = useAuthentication()

  const form = useForm<User>(async () => {
    if (user == form.values) {
      closeForm()
      return
    }
    const { res, data } = await useApi('/auth/user', {
      method: 'PUT',
      body: {
        email: form.values.email,
        first_name: form.values.first_name,
        last_name: form.values.last_name,
      },
    })
    if (!res.ok) {
      setError(data?.detail ?? data?.message ?? 'Error')
      return
    }
    login(data?.access_token)
    getCurrentUser()
    closeForm()
  }, user)

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
                  type='text'
                  className='bg-dark text-white'
                  placeholder='Email'
                  size='lg'
                  name='email'
                  required={true}
                  value={form.values?.email}
                  onChange={form.onChange}
                />
              </Form.Group>
              <Form.Group className='mb-4 mx-5 w-100'>
                <Form.Control
                  type='text'
                  className='bg-dark text-white'
                  placeholder='First Name'
                  size='lg'
                  name='first_name'
                  required={true}
                  value={form.values?.first_name}
                  onChange={form.onChange}
                />
              </Form.Group>
              <Form.Group className='mb-4 mx-5 w-100'>
                <Form.Control
                  type='text'
                  className='bg-dark text-white'
                  placeholder='Last Name'
                  size='lg'
                  name='last_name'
                  required={true}
                  value={form.values?.last_name}
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
