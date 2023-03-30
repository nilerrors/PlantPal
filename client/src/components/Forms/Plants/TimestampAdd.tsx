import { useState } from 'react'
import { Form, Card, Col, Row, Button, InputGroup } from 'react-bootstrap'
import { useAuthentication } from '../../../contexts/AuthenticationContext'
import { useForm } from '../../../hooks/useForm'
import { DayOfWeek, TimeStamp } from '../../../types'

type Props = {
  plant_id: string
  add: (timestamp: TimeStamp) => void
}

export function TimestampAdd({ plant_id, add }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { useApi } = useAuthentication()
  const form = useForm(
    async () => {
      setLoading(true)

      const res = await useApi('/plants_collection/', {
        method: 'POST',
        body: {
          day_of_week: form.values.day_of_week,
          hour: form.values.hour,
          minute: form.values.minute,
        },
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.detail ?? data?.message ?? 'Error')
        return
      }
      form.set({ day_of_week: DayOfWeek.everyday, hour: 0, minute: 0 })
      setLoading(false)
      add(data)
    },
    {
      day_of_week: DayOfWeek.everyday,
      hour: 0,
      minute: 0,
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
              <Form.Group className='mb-4 mx-5'>
                <InputGroup>
                  <Form.Select
                    name='day_of_week'
                    placeholder='Day Of Week'
                    className='bg-dark text-white'
                    size='lg'
                    onChange={form.onChange}
                    required={true}
                    value={form.values?.day_of_week ?? DayOfWeek.everyday}
                  >
                    <option disabled={true}>Day Of Week</option>
                    <option value={DayOfWeek.everyday}>Everyday</option>
                    <option value={DayOfWeek.monday}>Monday</option>
                    <option value={DayOfWeek.tuesday}>Tuesday</option>
                    <option value={DayOfWeek.wednesday}>Wednesday</option>
                    <option value={DayOfWeek.thursday}>Thursday</option>
                    <option value={DayOfWeek.friday}>Friday</option>
                    <option value={DayOfWeek.saturday}>Saturday</option>
                    <option value={DayOfWeek.sunday}>Sunday</option>
                  </Form.Select>
                  <Form.Control
                    type='number'
                    className='bg-dark text-white'
                    placeholder='Hour'
                    size='lg'
                    name='hour'
                    max={23}
                    min={0}
                    value={form.values?.hour}
                    onChange={form.onChange}
                  />
                  <Form.Control
                    type='number'
                    className='bg-dark text-white'
                    placeholder='Hour'
                    size='lg'
                    name='minute'
                    max={59}
                    min={0}
                    value={form.values?.minute}
                    onChange={form.onChange}
                  />
                </InputGroup>
              </Form.Group>
              <Button
                type='submit'
                className='mx-2 px-5'
                color='white'
                size='lg'
                variant='primary'
              >
                {loading ? 'Loading...' : 'Add'}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Form>
  )
}
