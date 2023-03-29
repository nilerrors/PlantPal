import { useEffect, useState } from 'react'
import { Button, Collapse, Container } from 'react-bootstrap'
import { ChangeUser } from '../components/Forms/ChangeUser'
import { useAuthentication } from '../contexts/AuthenticationContext'
import { User } from '../types'

export function Settings() {
  document.title = 'Settings'
  const [user, setUser] = useState<User | null>()
  const [openForm, setOpenForm] = useState(false)

  const { useApi } = useAuthentication()

  useEffect(() => {
    useApi('/auth/user')
      .then((res) => res.json())
      .then((data) => setUser(data))
  }, [])

  return (
    <Container className='bg-dark text-align-center'>
      {user != null ? (
        <>
          <h3>User Account</h3>
          <Button
            onClick={() => setOpenForm(!openForm)}
            style={{ float: 'right' }}
          >
            {openForm ? 'Close Form' : 'Change'}
          </Button>
          <hr />
          <Collapse in={!openForm}>
            <div>
              <pre>{JSON.stringify(user, undefined, 2)}</pre>
            </div>
          </Collapse>
          <Collapse in={openForm}>
            <div>
              <ChangeUser user={user} />
            </div>
          </Collapse>
        </>
      ) : null}
    </Container>
  )
}
