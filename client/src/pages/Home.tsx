import { useEffect, useState } from 'react'
import { Card, Container, ListGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuthentication } from '../contexts/AuthenticationContext'
import type { PlantsCollection } from '../types'

export function Home() {
  const [plantsCollections, setPlantsCollections] = useState<
    PlantsCollection[]
  >([])

  const { useApi } = useAuthentication()

  useEffect(() => {
    useApi('/plants_collection/')
      .then((res) => res.json())
      .then((data) => {
        setPlantsCollections(data)
      })
  }, [])

  return (
    <Container className='bg-dark text-align-center'>
      <h2>Plants Collections</h2>
      <hr />
      {/* <Card style={{ width: '18rem' }}>
        <Card.Body>
          <Card.Title>Card Title</Card.Title>
          <Card.Text>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </Card.Text>
        </Card.Body>
        
        <Card.Body>
          <Card.Link href='#'>Card Link</Card.Link>
          <Card.Link href='#'>Another Link</Card.Link>
        </Card.Body>
      </Card> */}
      <ListGroup className='list-group-flush'>
        {plantsCollections.map((p) => (
          <Link to={`/plants-collection/${p.id}`} key={p.id}>
            <ListGroup.Item
              variant={p.name == '$Plants' ? 'primary' : 'secondary'}
            >
              {p.name}
            </ListGroup.Item>
          </Link>
        ))}
      </ListGroup>
    </Container>
  )
}
