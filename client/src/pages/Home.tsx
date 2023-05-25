import { Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuthentication } from '../contexts/AuthenticationContext'

export function Home() {
  document.title = 'PlantPal'

  const { user } = useAuthentication()

  return (
    <Container className='bg-dark text-align-center'>
      <h1>
        Welcome {user?.first_name} {user?.last_name}!
      </h1>
      <br />
      <br />
      <h2>
        Go to{' '}
        <Link to='/plants' className='text-underline-hover'>
          <span className='display-1'>Plants</span>
        </Link>
      </h2>
      <h2>
        Go to{' '}
        <Link to='/settings' className='text-underline-hover'>
          <span className='display-1'>Settings</span>
        </Link>
      </h2>
      <h2 className='fixed-bottom mb-5 mx-5'>
        <Link to='/signout' className='text-underline-hover'>
          <span className='display-4 text-danger'>Sign Out</span>
        </Link>
      </h2>
    </Container>
  )
}
