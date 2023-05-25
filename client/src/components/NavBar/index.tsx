import { Navbar, Container } from 'react-bootstrap'

import { MobileNavBar } from './MobileNavBar'
import { DesktopNavBar } from './DesktopNavBar'
import { Link, useNavigate } from 'react-router-dom'

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
    },
  ]

  return (
    <Navbar
      bg='success'
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
          <Navbar.Brand className='text-dark text-underline-hover'>
            PlantPal
          </Navbar.Brand>
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
