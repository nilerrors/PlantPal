import { useEffect, useState } from 'react'
import { Container, ListGroup } from 'react-bootstrap'
import { Button } from '../components/Button'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthentication } from '../contexts/AuthenticationContext'
import { PeriodStamp } from '../types'
import { PeriodstampsChange } from '../components/Forms/Plants/PeriodstampsChange'

export function Periodstamps() {
  document.title = 'Periodstamps'
  const { id } = useParams()
  const { useApi } = useAuthentication()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [periodstamps, setPeriodstamps] = useState<PeriodStamp[]>([])

  if (id == undefined) {
    navigate('/plants')
    return null
  }

  const capitalize = (s: any): string =>
    (s && s.toString()[0].toUpperCase() + s.toString().slice(1)) || ''

  const time = (h: number, m: number) =>
    (h < 10 ? `0${h.toString()}` : h.toString()) +
    ':' +
    (m < 10 ? `0${m.toString()}` : m.toString())

  const fetchPeriodstamps = () => {
    setLoading(true)
    useApi(`/plants/${id}/periodstamps`)
      .then(({ res, data }) => {
        if (!res.ok) return
        return data
      })
      .then((data) => {
        if (data?.periodstamps != undefined) {
          setPeriodstamps(data.periodstamps)
        }
      })
    setLoading(false)
  }

  useEffect(() => {
    fetchPeriodstamps()
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
        Periodstamps
      </h3>
      <hr />
      {loading ? null : (
        <>
          {periodstamps.length > 0 ? (
            <>
              {periodstamps.map((p, i) => (
                <div
                  key={p.id}
                  className='list-group-flush list-group text-underline-hover'
                >
                  <div
                    className={`mt-3 input-group-btn input-group ${
                      periodstamps.length - i === 1 ? 'mb-3' : ''
                    }`}
                  >
                    <div className='form-control p-0'>
                      <ListGroup.Item key={p.id} variant='secondary'>
                        {capitalize(p.day_of_week)} at {time(p.hour, p.minute)}
                      </ListGroup.Item>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <h1>No Periodstamps</h1>
          )}
          <PeriodstampsChange
            plant_id={id}
            times_a_week={periodstamps.length}
            refetch={() => fetchPeriodstamps()}
          />
        </>
      )}
    </Container>
  )
}
