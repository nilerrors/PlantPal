import { useState } from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'

type URL = {
  path: string
  title: string
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
        style={{ borderColor: 'black' }}
      />
      <Navbar.Collapse id='desktopNavbar' appear={show}>
        <Nav className='overflow-hidden ms-auto'>
          {urls.map((url) => (
            <Nav.Item key={url.title} className='my-lg-0'>
              <Link
                to={url.path}
                className={`text-white mx-2 text-underline-hover px-2`}
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
