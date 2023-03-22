import { useEffect, useState } from 'react'
import { Button, Container, Collapse } from 'react-bootstrap'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ChangePlant } from '../components/Forms/ChangePlant'
import { PlantOverview } from '../components/Overview/PlantOverview'
import { useAuthentication } from '../contexts/AuthenticationContext'
import { useForm } from '../hooks/useForm'
import { Plant } from '../types'

export function Plant() {
  const [plant, setPlant] = useState<Plant | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [openForm, setOpenForm] = useState(false)
  const form = useForm<Plant | null>(async (e: Event) => {
    // Change Plant
    if (plant == form.values) return

    const res = await useApi('', {
      method: '',
    })
  }, plant)
  const { id } = useParams()
  const { useApi } = useAuthentication()

  if (id === undefined) {
    return <Navigate to='/plants' />
  }

  useEffect(() => {
    useApi(`/plants_collection/plants/${id}`)
      .then((res) => {
        if (!res.ok) {
          res
            .json()
            .then((data) => setError(data?.detail ?? data?.message ?? 'Error'))
          return
        }
        return res.json()
      })
      .then((data) => {
        setPlant(data)
        form.set(data)
      })
  }, [])

  return (
    <Container className='bg-dark text-align-center'>
      {plant != null && (
        <>
          <h3>
            '{plant?.name}' in{' '}
            <Link to={`/plants/${plant.collection?.id}`}>
              {plant?.collection?.name}
            </Link>
            <Button
              onClick={() => setOpenForm(!openForm)}
              style={{ float: 'right' }}
            >
              {openForm ? 'Close Form' : 'Change'}
            </Button>
          </h3>
          <hr />
          {error != null ? (
            <>{error}</>
          ) : (
            <>
              <Collapse in={!openForm}>
                <div>
                  <PlantOverview plant={plant} />
                </div>
              </Collapse>
              <Collapse in={openForm}>
                <div>
                  <ChangePlant plant={plant} form={form} />
                </div>
              </Collapse>
            </>
          )}
        </>
      )}
    </Container>
  )
}
