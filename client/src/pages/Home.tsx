import { useEffect, useState } from 'react'
import { Card, Collapse, Container, ListGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuthentication } from '../contexts/AuthenticationContext'
import type { PlantsCollection } from '../types'

export function Home() {
  document.title = 'PlantPal'

  return (
    <Container className='bg-dark text-align-center'>
      <Link to='/tutorial'>
        <h2>Setup Tutorial</h2>
      </Link>
    </Container>
  )
}
