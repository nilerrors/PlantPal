import { Form, Button, Row, Card, Col } from 'react-bootstrap'
import { FormT } from '../../types'

type Props = {
  form: FormT<any>
}

export function ChangePlantsCollection({ form }: Props) {
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
