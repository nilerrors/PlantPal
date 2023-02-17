import { Navbar, Container } from 'react-bootstrap'

import { MobileNavBar } from './MobileNavBar'
import { DesktopNavBar } from './DesktopNavBar'
import { Link, useLocation } from 'react-router-dom'

export function NavBar() {
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
        <Link to='/'>
          <Navbar.Brand>Plants Management</Navbar.Brand>
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
