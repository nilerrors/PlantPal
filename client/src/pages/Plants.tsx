import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, Collapse, Container, ListGroup } from 'react-bootstrap'
import { useAuthentication } from '../contexts/AuthenticationContext'
import { PlantsCollection } from '../types'

export function Plants() {
  const [plantsCollectionOpen, setPlantsCollectionOpen] = useState(true)
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
      <h3>Plants Collections</h3>
      <hr />
      <Collapse in={plantsCollectionOpen}>
        <ListGroup className='list-group-flush'>
          {plantsCollections.map((p) => (
            <Link to={`/plants/${p.id}`} key={p.id}>
              <ListGroup.Item
                variant={p.name == '$Plants' ? 'primary' : 'secondary'}
                style={{
                  fontSize: p.name == '$Plants' ? '2vh' : undefined,
                }}
              >
                {p.name}
              </ListGroup.Item>
            </Link>
          ))}
        </ListGroup>
      </Collapse>
    </Container>
  )
}
