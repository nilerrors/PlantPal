import { useEffect, useState } from 'react'
import { Button, Container, Collapse } from 'react-bootstrap'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ChangePlant } from '../components/Forms/Plants/ChangePlant'
import { PlantOverview } from '../components/Overview/PlantOverview'
import { useAuthentication } from '../contexts/AuthenticationContext'
import { useForm } from '../hooks/useForm'
import { Plant } from '../types'

export function Plant() {
  const [plant, setPlant] = useState<Plant>({} as Plant)
  document.title = plant != null ? plant?.name : 'Plant'
  const [error, setError] = useState<string | null>(null)
  const [openForm, setOpenForm] = useState(false)
  const form = useForm<Plant>(async () => {
    // Change Plant
    if (plant == undefined) return
    if (form.values == plant) {
      setOpenForm(false)
      return
    }

    const { res, data } = await useApi(`/plants/${plant.id}`, {
      method: 'PUT',
      body: {
        name: form.values?.name,
        water_amount: form.values?.water_amount,
        auto_irrigation: form.values?.auto_irrigation,
        irrigation_type: form.values?.irrigation_type,
        moisture_percentage_treshold: form.values?.moisture_percentage_treshold,
        periodstamp_times_a_week: form.values?.periodstamp_times_a_week,
      },
    })
    if (!res.ok) {
      setError(data?.detail ?? data?.message ?? 'Error')
      return
    }
    setPlant({ ...plant, ...JSON.parse(JSON.stringify(data)) })
    form.set({ ...form.values, ...JSON.parse(JSON.stringify(data)) })
    setOpenForm(false)
  }, plant)
  const { id } = useParams()
  const { useApi } = useAuthentication()

  if (id === undefined) {
    return <Navigate to='/plants' />
  }

  useEffect(() => {
    useApi(`/plants/${id}`)
      .then(({ res, data }) => {
        if (!res.ok) {
          setError(data?.detail ?? data?.message ?? 'Error')
          return
        }
        return data
      })
      .then((data) => {
        setPlant(data ?? plant)
        form.set(plant)
      })
  }, [])

  return (
    <Container className='bg-dark text-align-center'>
      {JSON.stringify(plant) != JSON.stringify({}) && (
        <>
          <h3>
            {plant?.name}
            <Button
              onClick={() => setOpenForm(!openForm)}
              style={{ float: 'right' }}
            >
              {openForm ? 'Close Form' : 'Change'}
            </Button>
            <Button style={{ float: 'right' }} className='mx-2'>
              <Link
                to={`/plant/${plant.id}/timestamps`}
                className='text-white text-underline-hover'
              >
                Timestamps
              </Link>
            </Button>
            <Button style={{ float: 'right' }}>
              <Link
                to={`/plant/${plant.id}/periodstamps`}
                className='text-white text-underline-hover'
              >
                Periodstamps
              </Link>
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
