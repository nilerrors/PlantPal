import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { Button } from '../components/Button'
import { useNavigate, useParams } from 'react-router-dom'
import { TimestampAdd } from '../components/Forms/Plants/TimestampAdd'
import { TimestampsOverview } from '../components/Overview/TimestampsOverview'
import { useAuthentication } from '../contexts/AuthenticationContext'
import { TimeStamp } from '../types'

export function Timestamps() {
  document.title = 'Timestamps'
  const { id } = useParams()
  const { useApi } = useAuthentication()
  const navigate = useNavigate()
  const [timestamps, setTimestamps] = useState<TimeStamp[]>([])

  if (id == undefined) {
    navigate('/plants')
    return null
  }

  useEffect(() => {
    useApi(`/plants/${id}/timestamps`)
      .then(({ res, data }) => {
        if (!res.ok) return
        return data
      })
      .then((data) => {
        if (data?.timestamps != undefined) {
          setTimestamps(data.timestamps)
        }
      })
  }, [])

  return (
    <Container className='bg-dark text-align-center'>
      <h3>
        <Button
          size='sm'
          variant='secondary'
          onClick={() => {
            navigate(`/plants/${id}`)
          }}
        >
          {'<'} Back
        </Button>{' '}
        Timestamps
        <Button
          onClick={() => undefined}
          style={{ float: 'right' }}
          variant='danger'
        >
          Remove All
        </Button>
      </h3>
      <hr />
      <TimestampsOverview
        plant_id={id}
        timestamps={timestamps}
        remove={(timestamp_id) => {
          setTimestamps(timestamps.filter((t) => t.id != timestamp_id))
        }}
      />
      <TimestampAdd
        plant_id={id}
        add={(timestamp) => {
          setTimestamps([...timestamps, timestamp])
        }}
      />
    </Container>
  )
}
