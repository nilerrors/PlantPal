import { useEffect, useState } from 'react'
import { Button, Collapse, Container } from 'react-bootstrap'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { ChangePlantsCollection } from '../components/Forms/ChangePlantsCollection'
import { PlantsCollectionOverview } from '../components/Overview/PlantsCollectionOverview'
import { useAuthentication } from '../contexts/AuthenticationContext'
import { usePlantsCollections } from '../contexts/PlantsCollectionsContext'
import { useForm } from '../hooks/useForm'
import { Plant, PlantsCollection } from '../types'

export function PlantsCollection() {
  const { id } = useParams()
  const { useApi } = useAuthentication()
  const { remove } = usePlantsCollections()
  const navigate = useNavigate()
  const form = useForm(async () => {}, {
    name: '',
  })

  const [openForm, setOpenForm] = useState(false)
  const [plantsCollection, setPlantsCollection] =
    useState<PlantsCollection | null>(null)
  const [plants, setPlants] = useState<Plant[]>([])

  if (id === undefined) {
    return <Navigate to='/' />
  }

  useEffect(() => {
    useApi(`/plants_collection/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPlantsCollection(data)
        setPlants(data?.plants ?? [])
      })
    document.title = `${plantsCollection?.name}`
  }, [])

  return (
    <Container className='bg-dark text-align-center'>
      {plantsCollection != null ? (
        <>
          <h3>
            {plantsCollection?.name}
            {plantsCollection?.name !== '$Plants' ? (
              <>
                <Button
                  onClick={() => setOpenForm(!openForm)}
                  style={{ float: 'right' }}
                >
                  {openForm ? 'Close Form' : 'Change'}
                </Button>
                <Button
                  className='mx-2'
                  onClick={async () => {
                    if (
                      confirm(
                        `Are you sure you want to remove plants collection '${plantsCollection.name}'?`
                      )
                    ) {
                      remove(plantsCollection.id)
                      navigate('/plants')
                    }
                  }}
                  variant='danger'
                  style={{ float: 'right', display: 'inline' }}
                >
                  Remove
                </Button>
              </>
            ) : null}
          </h3>
          <hr />
          <Collapse in={!openForm}>
            <div>
              <PlantsCollectionOverview
                plantsCollection={plantsCollection}
                plants={plants}
                removePlant={(plant_id) => {
                  setPlants(plants.filter((p) => p.id != plant_id))
                }}
              />
            </div>
          </Collapse>
          <Collapse in={openForm}>
            <div>
              <ChangePlantsCollection form={form} />
            </div>
          </Collapse>
        </>
      ) : null}
    </Container>
  )
}
