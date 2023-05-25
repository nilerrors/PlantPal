import { useState } from 'react'
import { Card, Col, Collapse, Row } from 'react-bootstrap'
import { Button } from '../../Button'
import { User } from '../../../types'
import { ChangeUser } from './ChangeUser'
import { ChangeUserPassword } from './ChangeUserPassword'
import { RemoveUser } from './RemoveUser'

type Props = {
  user: User
  setOpenForm: React.Dispatch<React.SetStateAction<boolean>>
}

export function UserAccountForm({ user, setOpenForm }: Props) {
  const [{ update_account, update_password, delete_account }, setState] =
    useState({
      update_account: false,
      update_password: false,
      delete_account: false,
    })

  function closeForm() {
    setState({
      update_account: false,
      update_password: false,
      delete_account: false,
    })
  }

  return (
    <>
      {update_account || update_password || delete_account ? (
        <>
          <Button
            className='px-1 my-1'
            color='white'
            size='sm'
            variant='secondary'
            onClick={() => closeForm()}
          >
            {'<'} Back
          </Button>
          <Collapse in={update_account}>
            <div>
              <ChangeUser
                user={user}
                closeForm={() => {
                  setOpenForm(false)
                  closeForm()
                }}
              />
            </div>
          </Collapse>
          <Collapse in={update_password}>
            <div>
              <ChangeUserPassword
                user={user}
                closeForm={() => {
                  setOpenForm(false)
                  closeForm()
                }}
              />
            </div>
          </Collapse>
          <Collapse in={delete_account}>
            <div>
              <RemoveUser
                user={user}
                closeForm={() => {
                  setOpenForm(false)
                  closeForm()
                }}
              />
            </div>
          </Collapse>
        </>
      ) : (
        <Row className='d-flex justify-content-center align-items-center'>
          <Col col='12'>
            <Card
              className='bg-dark text-white my-5 mx-auto'
              style={{ borderRadius: '1rem', maxWidth: '700px' }}
            >
              <Card.Body className='p-5 d-flex flex-column align-items-center mx-auto w-100'>
                <Button
                  className='mx-2 px-5 my-1'
                  color='white'
                  size='lg'
                  variant='primary'
                  onClick={() =>
                    setState({
                      update_account: true,
                      update_password: false,
                      delete_account: false,
                    })
                  }
                >
                  Update Account
                </Button>
                <Button
                  className='mx-2 px-5 my-1'
                  color='white'
                  size='lg'
                  variant='primary'
                  onClick={() =>
                    setState({
                      update_account: false,
                      update_password: true,
                      delete_account: false,
                    })
                  }
                >
                  Update Password
                </Button>
                <Button
                  className='mx-2 px-5 my-1'
                  color='white'
                  size='lg'
                  variant='danger'
                  onClick={() =>
                    setState({
                      update_account: false,
                      update_password: false,
                      delete_account: true,
                    })
                  }
                >
                  Remove Account
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </>
  )
}
