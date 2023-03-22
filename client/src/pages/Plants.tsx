import { useEffect, useState } from 'react'
import {
  Button,
  Card,
  Collapse,
  Container,
  Form,
  InputGroup,
  ListGroup,
} from 'react-bootstrap'
import { useAuthentication } from '../contexts/AuthenticationContext'
import { PlantsCollection } from '../types'
import { PlantsCollectionsOverview } from '../components/Overview/PlantsCollectionsOverview'
import { PlantsCollectionsAdd } from '../components/Forms/PlantsCollectionsAdd'

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

  function addToPlantsCollection(collection: PlantsCollection) {
    setPlantsCollections([...plantsCollections, collection])
  }

  return (
    <Container className='bg-dark text-align-center'>
      <h3>
        Plants Collections
        <span>
          <Button
            onClick={() => setPlantsCollectionOpen(!plantsCollectionOpen)}
            style={{ float: 'right' }}
            className='mx-2'
          >
            {!plantsCollectionOpen ? 'Close Form' : 'Add'}
          </Button>
        </span>
      </h3>
      <hr />
      <Collapse in={plantsCollectionOpen}>
        <div>
          <PlantsCollectionsOverview collections={plantsCollections} />
        </div>
      </Collapse>
      <Collapse in={!plantsCollectionOpen}>
        <div>
          <PlantsCollectionsAdd addToCollection={addToPlantsCollection} />
        </div>
      </Collapse>
    </Container>
  )
}
