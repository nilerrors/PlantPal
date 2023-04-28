import { useEffect, useState } from 'react'
import { Collapse, Container } from 'react-bootstrap'
import { Button } from '../components/Button'
import { UserAccountForm } from '../components/Forms/User/UserAccount'
import { UserOverview } from '../components/Overview/UserOverview'
import { useAuthentication } from '../contexts/AuthenticationContext'

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
            <span
              style={{ display: window.innerWidth < 600 ? 'none' : undefined }}
            >
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
          {window.innerWidth > 600 ? (
            <>
              <Collapse in={openForm}>
                <div>
                  <UserAccountForm user={user} setOpenForm={setOpenForm} />
                </div>
              </Collapse>
            </>
          ) : (
            <>
              <UserAccountForm user={user} setOpenForm={setOpenForm} />
            </>
          )}
        </>
      ) : null}
    </Container>
  )
}
