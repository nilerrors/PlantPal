import { ListGroup } from 'react-bootstrap'
import { useAuthentication } from '../../contexts/AuthenticationContext'
import { TimeStamp } from '../../types'
import { ListItemRemoveButton } from '../ListItemRemoveButton'

type Props = {
  timestamps: TimeStamp[]
  remove: (timestamp_id: string) => void
}

export function TimestampsOverview({ timestamps, remove }: Props) {
  const { useApi } = useAuthentication()

  return (
    <>
      <ListGroup className='list-group-flush'>
        {timestamps.map((timestamp) => (
          <ListItemRemoveButton
            id={timestamp.id}
            to={`/plant/${timestamp.id}`}
            key={timestamp.id}
            name={`${timestamp.day_of_week} at ${timestamp.hour}:${timestamp.minute}`}
            type='plant'
            onRemove={() => {
              useApi(`/plants_collection/plants/${timestamp.id}`, {
                method: 'DELETE',
              })
                .then((res) => res.json())
                .then((data) => {
                  alert(data?.message ?? data?.detail ?? '')
                })
              remove(timestamp.id)
            }}
          />
        ))}
      </ListGroup>
    </>
  )
}
