import { useState } from 'react'
import {
  Container,
  Form,
  Row,
  Col,
  Card,
  Alert,
  Collapse,
} from 'react-bootstrap'
import { Button } from '../../components/Button'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuthentication } from '../../contexts/AuthenticationContext'
import { useForm } from '../../hooks/useForm'
import { VerifyResend } from '../../components/Forms/Verify/VerifyResend'
import { VerifyLogin } from '../../components/Forms/Verify/VerifyLogin'

export function VerifyFirst() {
  document.title = 'Verification'
  document.body.style.background =
    'linear-gradient(to right, rgba(106, 17, 203, 1), rgba(37, 117, 252, 1))'

  const [show, setShow] = useState<'selection' | 'verify' | 'resend'>(
    'selection'
  )

  return (
    <Container fluid className='user-select-none'>
      <Collapse in={show === 'selection'}>
        <div>
          <Row
            style={{ width: '40%' }}
            className='d-flex justify-content-center mx-auto mt-5'
          >
            <Col col='12'>
              <Card className='bg-dark text-white p-5'>
                <Card.Header className='text-center'>
                  <h2>Verification</h2>
                </Card.Header>
                <Card.Body className='d-flex justify-content-center gap-3'>
                  <Button onClick={() => setShow('verify')}>
                    Verify Account
                  </Button>
                  <Button onClick={() => setShow('resend')}>
                    Resend Verification Email
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </Collapse>
      <Collapse in={show === 'verify'}>
        <div>
          <VerifyLogin goBack={() => setShow('selection')} />
        </div>
      </Collapse>
      <Collapse in={show === 'resend'}>
        <div>
          <VerifyResend goBack={() => setShow('selection')} />
        </div>
      </Collapse>
    </Container>
  )
}
