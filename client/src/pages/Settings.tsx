import { useEffect, useState } from 'react'
import { Button, Collapse, Container } from 'react-bootstrap'
import { ChangeUser } from '../components/Forms/User/ChangeUser'
import { UserAccountForm } from '../components/Forms/User/UserAccount'
import { UserOverview } from '../components/Overview/UserOverview'
import { useAuthentication } from '../contexts/AuthenticationContext'
import { User } from '../types'

export function Settings() {
  document.title = 'Settings'
  const { user } = useAuthentication()
  const [openForm, setOpenForm] = useState(false)

  return (
    <Container className='bg-dark text-align-center'>
      {user != null ? (
        <>
          <h3>
            User Account
            <span>
              <Button
                onClick={() => setOpenForm(!openForm)}
                style={{ float: 'right' }}
              >
                {openForm ? 'Close Form' : 'Change'}
              </Button>
            </span>
          </h3>
          <hr />
          <Collapse in={!openForm}>
            <div>
              <UserOverview user={user} />
            </div>
          </Collapse>
          <Collapse in={openForm}>
            <div>
              <UserAccountForm user={user} setOpenForm={setOpenForm} />
            </div>
          </Collapse>
        </>
      ) : null}
    </Container>
  )
}
