import { useEffect, useState } from 'react'
import {
  Form,
  Button,
  Container,
  InputGroup,
  Row,
  Card,
  Col,
} from 'react-bootstrap'
import { Navigate, useParams } from 'react-router-dom'
import { useAuthentication } from '../contexts/AuthenticationContext'
import { useForm } from '../hooks/useForm'
import { Plant } from '../types'

export function Plant() {
  const [plant, setPlant] = useState<Plant | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { id } = useParams()

  const form = useForm<Plant | null>(async () => {}, plant)

  const { useApi } = useAuthentication()

  if (id === undefined) {
    return <Navigate to='/plants' />
  }

  useEffect(() => {
    useApi(`/plants_collection/plants/${id}`)
      .then((res) => {
        if (!res.ok) {
          res
            .json()
            .then((data) => setError(data?.detail ?? data?.message ?? 'Error'))
          return
        }
        return res.json()
      })
      .then((data) => {
        setPlant(data)
        form.set(data)
      })
  }, [])

  return (
    <Container className='bg-dark text-align-center'>
      {plant != null && (
        <>
          <h3>
            '{plant?.name}' in {plant?.collection?.name}
          </h3>
          <hr />
          {error != null ? (
            <>{error}</>
          ) : (
            <>
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
                            placeholder='Name'
                            size='lg'
                            name='name'
                            value={form.values?.name}
                            onChange={form.onChange}
                          />
                        </Form.Group>
                        <Form.Group className='mb-4 mx-5 w-100'>
                          <Form.Control
                            type='number'
                            className='bg-dark text-white'
                            placeholder='Water Amount'
                            size='lg'
                            name='water_amount'
                            min={100}
                            max={5000}
                            value={form.values?.water_amount}
                            onChange={form.onChange}
                          />
                        </Form.Group>
                        <Form.Group className='d-flex flex-row justify-content-center mb-4'>
                          <Form.Check
                            label='Auto Irrigation'
                            name='auto_irrigation'
                            checked={form.values?.auto_irrigation}
                            onChange={form.onChange}
                          />
                        </Form.Group>
                        <Form.Group className='mb-4 mx-5 w-100'>
                          <Form.Select
                            name='irrigation_type'
                            className='bg-dark text-white'
                            size='lg'
                            onChange={form.onChange}
                            value={form.values?.irrigation_type}
                          >
                            <option>Irrigation Type</option>
                            <option value='period'>Period</option>
                            <option value='time'>Time</option>
                          </Form.Select>
                        </Form.Group>
                        {form.values?.irrigation_type == 'period' ? (
                          <Form.Group className='mb-4 mx-5 w-100'>
                            <Form.Control
                              type='number'
                              name='periodstamp_times_a_week'
                              className='bg-dark text-white'
                              min={0}
                              max={10}
                              size='lg'
                              onChange={form.onChange}
                              value={form.values?.periodstamp_times_a_week}
                            />
                          </Form.Group>
                        ) : null}
                        <Button
                          type='submit'
                          className='mx-2 px-5'
                          color='white'
                          size='lg'
                          variant='secondary'
                        >
                          Change
                          {/* {loading ? 'Loading...' : 'Sign Up'} */}
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Form>
              <pre>{JSON.stringify(plant, undefined, 2)}</pre>
            </>
          )}
        </>
      )}
    </Container>
  )
}
