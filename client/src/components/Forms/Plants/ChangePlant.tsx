import { useNavigate } from 'react-router-dom'
import { FormT, Plant } from '../../../types'
import { Form, Row, Card, Col } from 'react-bootstrap'
import { Button } from '../../Button'

type Props = {
  plant: Plant
  form: FormT<Plant>
}

export function ChangePlant({ plant, form }: Props) {
  const navigate = useNavigate()

  // const { collections, refetch } = usePlantsCollections()

  return (
    <Form onSubmit={form.onSubmit}>
      <Row className='d-flex justify-content-center align-items-center'>
        <Col col='12'>
          <Card
            className='bg-dark text-white my-5 mx-auto'
            style={{ borderRadius: '1rem', maxWidth: '700px' }}
          >
            <Card.Body className='p-5 d-flex flex-column align-items-center mx-auto w-100'>
              <Form.Group className='mb-4 mx-5 w-100'>
                <Form.Control
                  type='text'
                  className='bg-dark text-white'
                  placeholder='Name'
                  size='lg'
                  name='name'
                  required={true}
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
                  required={true}
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
                <Form.Control
                  type='number'
                  className='bg-dark text-white'
                  placeholder='Moisture Percentage Threshold'
                  size='lg'
                  name='moisture_percentage_treshold'
                  min={0}
                  max={100}
                  required={true}
                  value={form.values?.moisture_percentage_treshold}
                  onChange={form.onChange}
                />
              </Form.Group>
              <Form.Group className='mb-4 mx-5 w-100'>
                <Form.Select
                  name='irrigation_type'
                  placeholder='Irrigation Type'
                  className='bg-dark text-white'
                  size='lg'
                  onChange={form.onChange}
                  required={true}
                  value={form.values?.irrigation_type ?? 'period'}
                >
                  <option disabled={true}>Irrigation Type</option>
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
                  placeholder='Amount of irrigations per week'
                  name='periodstamp_times_a_week'
                  className='bg-dark text-white'
                  min={0}
                  max={20}
                  size='lg'
                  onChange={form.onChange}
                  required={true}
                  value={form.values?.periodstamp_times_a_week}
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
