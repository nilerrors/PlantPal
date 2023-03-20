import { MouseEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FormT, Plant } from '../../types'
import {
  Form,
  Button,
  Container,
  InputGroup,
  Row,
  Card,
  Col,
} from 'react-bootstrap'

type Props = {
  plant: Plant
  form: FormT<any>
}

export function ChangePlant({ plant, form }: Props) {
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  function handleChangeStamps(
    e: MouseEvent<HTMLButtonElement, MouseEvent> | MouseEvent,
    url: string
  ) {
    e.preventDefault()
    if (form.values != plant) {
      alert('Plant data has been changed. Save the data before continuing.')
      return
    }
    navigate(url)
  }

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
              <Form.Group
                className='mb-4 mx-5 w-100'
                style={{
                  display:
                    form.values?.irrigation_type != 'period' ? 'none' : '',
                }}
              >
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
              <Form.Text className='mb-4 mx-5'>
                <Button
                  className='mx-1'
                  variant='link'
                  onClick={(e) => handleChangeStamps(e, './timestamps')}
                >
                  Change Timestamps
                </Button>
                <Button
                  className='mx-1'
                  variant='link'
                  onClick={(e) => handleChangeStamps(e, './periodstamps')}
                >
                  Change Periodstamps
                </Button>
              </Form.Text>
              <Button
                type='submit'
                className='mx-2 px-5'
                color='white'
                size='lg'
                variant='primary'
              >
                Change
                {/* {loading ? 'Loading...' : 'Sign Up'} */}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Form>
  )
}