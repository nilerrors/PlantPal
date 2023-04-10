import { Navbar, Container } from 'react-bootstrap'

import { MobileNavBar } from './MobileNavBar'
import { DesktopNavBar } from './DesktopNavBar'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export function NavBar() {
  const navigate = useNavigate()

  const urls = [
    {
      path: '/plants',
      title: 'Plants',
    },
    {
      path: '/settings',
      title: 'Settings',
    },
    {
      path: '/signout',
      title: 'Sign out',
      danger: true,
    },
  ]

  return (
    <Navbar
      bg='primary'
      variant='dark'
      className='user-select-none fixed-top'
      expand='lg'
    >
      <Container>
        <Link
          to='/'
          onClick={() => {
            navigate('/')
            navigate(0)
          }}
        >
          <Navbar.Brand className='text-warning'>PlantPal</Navbar.Brand>
        </Link>
        {window.innerWidth < 600 ? (
          <MobileNavBar urls={urls} />
        ) : (
          <DesktopNavBar urls={urls} />
        )}
      </Container>
    </Navbar>
  )
}
