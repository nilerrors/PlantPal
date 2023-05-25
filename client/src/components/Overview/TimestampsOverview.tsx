import { ListGroup } from 'react-bootstrap'
import { useAuthentication } from '../../contexts/AuthenticationContext'
import { TimeStamp } from '../../types'
import { compareTimestamps } from '../../utils/compareDates'
import { ListItemRemoveButton } from '../ListItemRemoveButton'

type Props = {
  plant_id: string
  timestamps: TimeStamp[]
  remove: (timestamp_id: string) => void
}

export function TimestampsOverview({ plant_id, timestamps, remove }: Props) {
  const { useApi } = useAuthentication()

  const capitalize = (s: any): string =>
    (s && s.toString()[0].toUpperCase() + s.toString().slice(1)) || ''

  const time = (h: number, m: number) =>
    (h < 10 ? `0${h.toString()}` : h.toString()) +
    ':' +
    (m < 10 ? `0${m.toString()}` : m.toString())

  return (
    <>
      {timestamps.length > 0 ? (
        <>
          <ListGroup className='list-group-flush'>
            {timestamps
              .sort((t1, t2) => compareTimestamps(t1, t2))
              .map((timestamp) => (
                <ListItemRemoveButton
                  id={timestamp.id}
                  key={timestamp.id}
                  name={`${capitalize(timestamp.day_of_week)} at ${time(
                    timestamp.hour,
                    timestamp.minute
                  )}`}
                  type='timestamp'
                  onRemove={() => {
                    useApi(
                      `/plants_collection/plants/${plant_id}/timestamps/${timestamp.id}`,
                      {
                        method: 'DELETE',
                      }
                    )
                      .then(({ res, data }) => data)
                      .then((data) => {
                        alert(data?.message ?? data?.detail ?? '')
                      })
                    remove(timestamp.id)
                  }}
                />
              ))}
          </ListGroup>
        </>
      ) : (
        <h1>No Timestamps</h1>
      )}
    </>
  )
}
