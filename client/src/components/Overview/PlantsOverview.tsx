import { Collapse, ListGroup } from 'react-bootstrap'
import { Plant } from '../../types'
import { ListItemRemoveButton } from '../ListItemRemoveButton'
import { useAuthentication } from '../../contexts/AuthenticationContext'

type Props = {
  plants: Plant[]
  removePlant: (plant_id: string) => void
}

export function PlantsOverview({ plants, removePlant }: Props) {
  const { useApi } = useAuthentication()
  return (
    <>
      <ListGroup className='list-group-flush'>
        {plants.map((plant) => (
          <ListItemRemoveButton
            id={plant.id}
            to={`/plants/${plant.id}`}
            key={plant.id}
            name={plant.name}
            type='plant'
            onRemove={() => {
              useApi(`/plants_collection/plants/${plant.id}`, {
                method: 'DELETE',
              })
                .then(({ res, data }) => data)
                .then((data) => {
                  alert(data?.message ?? data?.detail ?? '')
                })
              removePlant(plant.id)
            }}
          />
        ))}
      </ListGroup>
    </>
  )
}
