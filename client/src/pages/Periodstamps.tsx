import { useEffect, useState } from 'react'
import { Button, Container, ListGroup } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { TimestampAdd } from '../components/Forms/Plants/TimestampAdd'
import { TimestampsOverview } from '../components/Overview/TimestampsOverview'
import { useAuthentication } from '../contexts/AuthenticationContext'
import { PeriodStamp } from '../types'

export function Periodstamps() {
  document.title = 'Periodstamps'
  const { id } = useParams()
  const { useApi } = useAuthentication()
  const navigate = useNavigate()
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

  useEffect(() => {
    useApi(`/plants_collection/plants/${id}/periodstamps`)
      .then((res) => {
        if (!res.ok) return
        return res.json()
      })
      .then((data) => {
        if (data?.periodstamps != undefined) {
          setPeriodstamps(data.periodstamps)
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
            navigate(`/plant/${id}`)
          }}
        >
          {'<'} Back
        </Button>{' '}
        Periodstamps
      </h3>
      <hr />
      {periodstamps.map((p, i) => (
        <div className='list-group-flush list-group text-underline-hover'>
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
    </Container>
  )
}
