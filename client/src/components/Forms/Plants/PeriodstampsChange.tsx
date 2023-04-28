import { useState } from 'react'
import { Form, Card, Col, Row, InputGroup } from 'react-bootstrap'
import { Button } from '../../Button'
import { useAuthentication } from '../../../contexts/AuthenticationContext'
import { useForm } from '../../../hooks/useForm'

type Props = {
  plant_id: string
  times_a_week: number
  refetch: () => void
}

export function PeriodstampsChange({ plant_id, times_a_week, refetch }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { useApi } = useAuthentication()

  const form = useForm(
    async () => {
      setLoading(true)

      const { res, data } = await useApi(`/plants/${plant_id}/periodstamps`, {
        method: 'POST',
        body: {
          times_a_week: form.values.times_a_week,
        },
      })
      if (!res.ok) {
        setError(data?.detail ?? data?.message ?? 'Error')
        setLoading(false)
        return
      }
      setLoading(false)
      refetch()
    },
    {
      times_a_week,
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
              <Form.Group className='mb-4 mx-1' style={{ width: '60%' }}>
                <Form.Control
                  type='number'
                  className='bg-dark text-white'
                  placeholder='Amount of irrigations per week'
                  size='lg'
                  name='times_a_week'
                  max={20}
                  min={0}
                  value={form.values?.times_a_week}
                  required
                  onChange={form.onChange}
                  onInput={(e: any) => {
                    if (e.target.value > 20) {
                      e.target.value = 20
                    }
                    if (e.target.value < 0) {
                      e.target.value = 0
                    }
                  }}
                />
              </Form.Group>
              <Button
                type='submit'
                className='mx-2 px-5'
                color='white'
                size='lg'
                variant='primary'
              >
                {loading ? 'Loading...' : 'Change'}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Form>
  )
}
