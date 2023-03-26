import { Collapse, ListGroup } from 'react-bootstrap'
import { Plant, PlantsCollection } from '../../types'
import { ListItemRemoveButton } from '../ListItemRemoveButton'
import { useAuthentication } from '../../contexts/AuthenticationContext'

type Props = {
  plantsCollection: PlantsCollection
  plants: Plant[]
  removePlant: (plant_id: string) => void
}

export function PlantsCollectionOverview({
  plantsCollection,
  plants,
  removePlant,
}: Props) {
  const { useApi } = useAuthentication()
  return (
    <>
      <h4>Name: {plantsCollection.name}</h4>
      <h4>
        Created At: {new Date(plantsCollection.created_at).toLocaleString()}
      </h4>
      {plantsCollection.created_at != plantsCollection.updated_at ? (
        <h4>
          Updated At: {new Date(plantsCollection.updated_at).toLocaleString()}
        </h4>
      ) : null}
      {plants != undefined && plants.length !== 0 ? (
        <>
          <h4>Plants</h4>
          <Collapse in={true}>
            <ListGroup className='list-group-flush'>
              {plants.map((plant) => (
                <ListItemRemoveButton
                  id={plant.id}
                  to={`/plant/${plant.id}`}
                  key={plant.id}
                  name={plant.name}
                  type='plant'
                  onRemove={() => {
                    useApi(`/plants_collection/plants/${plant.id}`, {
                      method: 'DELETE',
                    })
                      .then((res) => res.json())
                      .then((data) => {
                        alert(data?.message ?? data?.detail ?? '')
                      })
                    removePlant(plant.id)
                  }}
                />
              ))}
            </ListGroup>
          </Collapse>
        </>
      ) : (
        <>
          <h6>No Plants</h6>
        </>
      )}
    </>
  )
}
