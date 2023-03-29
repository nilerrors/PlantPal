import { useEffect, useState } from 'react'
import { Button, Container, Collapse } from 'react-bootstrap'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ChangePlant } from '../components/Forms/Plants/ChangePlant'
import { PlantOverview } from '../components/Overview/PlantOverview'
import { useAuthentication } from '../contexts/AuthenticationContext'
import { useForm } from '../hooks/useForm'
import { Plant } from '../types'

export function Plant() {
  const [plant, setPlant] = useState<Plant | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [openForm, setOpenForm] = useState(false)
  const form = useForm<Plant | null>(async () => {
    // Change Plant
    if (plant == undefined) return
    if (form.values == plant) {
      setOpenForm(false)
      return
    }

    const res = await useApi(`/plants_collection/plants/${plant.id}`, {
      method: 'PUT',
      body: {
        name: form.values?.name,
        water_amount: form.values?.water_amount,
        auto_irrigation: form.values?.auto_irrigation,
        irrigation_type: form.values?.irrigation_type,
        moisture_percentage_treshold: form.values?.moisture_percentage_treshold,
        periodstamp_times_a_week: form.values?.periodstamp_times_a_week,
        collection_id: form.values?.collection_id,
      },
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data?.detail ?? data?.message ?? 'Error')
      return
    }
    setPlant({ ...plant, ...JSON.parse(JSON.stringify(data)) })
    setOpenForm(false)
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
        const plant = {
          ...data,
          collection_id: data?.collection_id ?? undefined,
        }
        setPlant(plant)
        form.set(plant)
      })
    document.title = `${plant?.name}`
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
