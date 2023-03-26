import { ListGroup } from 'react-bootstrap'
import { usePlantsCollections } from '../../contexts/PlantsCollectionsContext'
import { ListItemRemoveButton } from '../ListItemRemoveButton'

type Props = {}

export function PlantsCollectionsOverview() {
  const { collections, remove } = usePlantsCollections()
  return (
    <ListGroup className='list-group-flush'>
      {collections.map((p) => (
        <ListItemRemoveButton
          key={p.id}
          id={p.id}
          name={p.name}
          to={`/plants/${p.id}`}
          nameAddition={p.count.toString()}
          isPrimary={p.name == '$Plants'}
          type='plants collection'
          onRemove={() => remove(p.id)}
        />
      ))}
    </ListGroup>
  )
}
