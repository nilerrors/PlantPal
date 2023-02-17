import { useState } from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthentication } from '../contexts/AuthenticationContext'

type URL = {
  path: string
  title: string
}

type DesktopNavBarProps = {
  urls: URL[]
}

export function DesktopNavBar({ urls }: DesktopNavBarProps) {
  const location = useLocation()
  const [show, setShow] = useState<boolean>()
  const { logout } = useAuthentication()
  const navigate = useNavigate()

  return (
    <>
      <Navbar.Toggle
        aria-controls='desktopNavbar'
        onClick={() => setShow(true)}
      />
      <Navbar.Collapse id='desktopNavbar' appear={show}>
        <Nav className='overflow-hidden ms-auto'>
          {urls.map((url) => (
            <Nav.Item key={url.title} className='my-lg-0'>
              <Link
                to={url.path}
                className='text-white mx-2 text-underline-hover px-2'
                onClick={() => setShow(false)}
              >
                {url.title}
              </Link>
            </Nav.Item>
          ))}
        </Nav>
        {/* <Nav>
        <Nav.Item key={url.title}>
            <Link
              to={url.path}
              className='text-white mx-2 text-underline-hover'
              onClick={() => setShow(false)}
            >
              {url.title}
            </Link>
          </Nav.Item>
        </Nav> */}
      </Navbar.Collapse>
    </>
  )
}
