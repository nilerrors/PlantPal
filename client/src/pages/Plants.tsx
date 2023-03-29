import { useEffect, useState } from 'react'
import { Button, Collapse, Container } from 'react-bootstrap'
import { PlantsCollectionsOverview } from '../components/Overview/PlantsCollectionsOverview'
import { PlantsCollectionsAdd } from '../components/Forms/Plants/PlantsCollectionsAdd'
import { usePlantsCollections } from '../contexts/PlantsCollectionsContext'

export function Plants() {
  document.title = 'Plants'
  const [plantsCollectionOpen, setPlantsCollectionOpen] = useState(true)
  const { refetch, add } = usePlantsCollections()

  useEffect(() => {
    refetch()
  }, [])

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
          <PlantsCollectionsOverview />
        </div>
      </Collapse>
      <Collapse in={!plantsCollectionOpen}>
        <div>
          <PlantsCollectionsAdd
            addToCollection={add}
            setFormClose={() => setPlantsCollectionOpen(true)}
          />
        </div>
      </Collapse>
    </Container>
  )
}
