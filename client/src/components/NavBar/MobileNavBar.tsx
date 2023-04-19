import { useState } from 'react'
import { Navbar, Offcanvas, CloseButton, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'

type URL = {
  path: string
  title: string
}

type MobileNavBarProps = {
  urls: URL[]
}

export function MobileNavBar({ urls }: MobileNavBarProps) {
  const [show, setShow] = useState<boolean>()

  return (
    <>
      <Navbar.Toggle
        onClick={() => setShow(true)}
        style={{ borderColor: 'black' }}
      />
      <Navbar.Offcanvas placement='end' show={show}>
        <Offcanvas.Header>
          <Offcanvas.Title style={{ fontSize: '2rem' }}>
            PlantPal
          </Offcanvas.Title>
          <CloseButton onClick={() => setShow(false)}></CloseButton>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className='justify-content-end flex-grow-1 pe-3'>
            {urls.map((url) => (
              <Nav.Item key={url.title} style={{ fontSize: '1.6rem' }}>
                <Link
                  to={url.path}
                  className={`text-dark mx-2 text-underline-hover`}
                  onClick={() => setShow(false)}
                >
                  {url.title}
                </Link>
              </Nav.Item>
            ))}
          </Nav>
        </Offcanvas.Body>
      </Navbar.Offcanvas>
    </>
  )
}
