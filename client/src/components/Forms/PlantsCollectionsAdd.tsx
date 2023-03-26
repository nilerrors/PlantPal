import { MouseEvent, useEffect, useState } from 'react'
import { Form, Button, Row, Card, Col } from 'react-bootstrap'
import { PlantsCollection } from '../../types'
import { useForm } from '../../hooks/useForm'
import { useAuthentication } from '../../contexts/AuthenticationContext'

type Props = {
  addToCollection: (collection: PlantsCollection) => void
  setFormClose: () => void
}

export function PlantsCollectionsAdd({ addToCollection, setFormClose }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { useApi } = useAuthentication()
  const form = useForm(
    async () => {
      if (form.values.name.trim() == '') {
        setError('Name not given')
        return
      }
      setLoading(true)

      const res = await useApi('/plants_collection/', {
        method: 'POST',
        body: {
          name: form.values.name,
        },
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.detail ?? data?.message ?? 'Error')
        return
      }
      setLoading(false)
      addToCollection(data)
      setFormClose()
    },
    {
      name: '',
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
            <Card.Body className='p-5 d-flex flex-column align-items-center mx-auto w-100'>
              {error != null && (
                <Form.Text className='small mb-3 pb-lg-2 text-danger'>
                  {error}
                </Form.Text>
              )}
              <Form.Group className='mb-4 mx-5 w-100'>
                <Form.Control
                  type='text'
                  className='bg-dark text-white'
                  placeholder='Collection Name'
                  size='lg'
                  name='name'
                  value={form.values?.name}
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
                {loading ? 'Loading...' : 'Create'}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Form>
  )
}
