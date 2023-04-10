import { useState } from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthentication } from '../../contexts/AuthenticationContext'

type URL = {
  path: string
  title: string
  danger?: boolean
}

type DesktopNavBarProps = {
  urls: URL[]
}

export function DesktopNavBar({ urls }: DesktopNavBarProps) {
  const [show, setShow] = useState<boolean>()

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
                className={`${
                  url.danger ? 'text-warning' : 'text-white'
                } mx-2 text-underline-hover px-2`}
                onClick={() => setShow(false)}
              >
                {url.title}
              </Link>
            </Nav.Item>
          ))}
        </Nav>
      </Navbar.Collapse>
    </>
  )
}
