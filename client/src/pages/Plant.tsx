import { useEffect, useState } from 'react'
import { Container, Collapse } from 'react-bootstrap'
import { Button } from '../components/Button'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ChangePlant } from '../components/Forms/Plants/ChangePlant'
import { PlantOverview } from '../components/Overview/PlantOverview'
import { useAuthentication } from '../contexts/AuthenticationContext'
import { useForm } from '../hooks/useForm'
import { Plant } from '../types'
import { PlantGraphs } from '../components/Graphs/PlantGraphs'

export function Plant() {
  const [plant, setPlant] = useState<Plant>({} as Plant)
  document.title = plant != null ? plant?.name : 'Plant'
  const [loading, setLoading] = useState(true)
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
    setLoading(true)
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
        form.set(data ?? plant)
        setLoading(false)
      })
  }, [])

  return (
    <Container className='bg-dark text-align-center'>
      {loading ? null : (
        <>
          <h3 style={{ display: window.innerWidth < 600 ? 'flex' : undefined }}>
            <span
              style={{
                width:
                  window.innerWidth < 600
                    ? `${(window.innerWidth / 600) * 100}%`
                    : undefined,
              }}
            >
              {plant?.name}
            </span>
            {window.innerWidth > 600 ? (
              <span style={{ float: 'right' }}>
                <span
                  style={{
                    display: window.innerWidth > 770 ? 'none' : undefined,
                  }}
                >
                  <Button
                    onClick={() => setOpenForm(!openForm)}
                    style={{ float: 'right' }}
                  >
                    {openForm ? 'Close Form' : 'Change'}
                  </Button>
                </span>
                <Button
                  style={{ float: 'right' }}
                  className={`mx-${window.innerWidth < 600 ? 1 : 2}`}
                >
                  <Link
                    to={`/plants/${plant.id}/timestamps`}
                    className='text-white text-underline-hover'
                  >
                    Timestamps
                  </Link>
                </Button>
                <Button
                  style={{ float: 'right' }}
                  className={`mt-${window.innerWidth < 600 ? '1' : undefined}`}
                >
                  <Link
                    to={`/plants/${plant.id}/periodstamps`}
                    className='text-white text-underline-hover'
                  >
                    Periodstamps
                  </Link>
                </Button>
              </span>
            ) : null}
          </h3>
          <hr />
          {error != null ? (
            <>{error}</>
          ) : (
            <>
              <Collapse in={!openForm}>
                <div>
                  <div
                    style={{
                      display: window.innerWidth > 770 ? 'flex' : undefined,
                      textAlign: window.innerWidth < 770 ? 'center' : undefined,
                    }}
                  >
                    <div
                      style={{
                        width: window.innerWidth > 770 ? '40%' : undefined,
                      }}
                    >
                      <PlantOverview plant={plant} />
                    </div>
                    {window.innerWidth > 770 ? (
                      <div
                        style={{
                          width: '50%',
                        }}
                      >
                        <ChangePlant plant={plant} form={form} />
                      </div>
                    ) : null}
                  </div>
                  {window.innerWidth > 600 ? (
                    <div style={{}} className='d-flex justify-content-center'>
                      <PlantGraphs id={plant.id} />
                    </div>
                  ) : (
                    <div
                      className='nav nav-pills nav-fill justify-content-center fixed-bottom mb-5'
                      style={{ zIndex: 100 }}
                    >
                      <span
                        style={{
                          display: window.innerWidth > 770 ? 'none' : undefined,
                        }}
                        className='nav-item'
                      >
                        <Button onClick={() => setOpenForm(!openForm)}>
                          <span className='nav-link text-white'>
                            {openForm ? 'Close Form' : 'Change'}
                          </span>
                        </Button>
                      </span>
                      <span className='nav-item'>
                        <Button
                          className={`mx-${window.innerWidth < 600 ? 1 : 2}`}
                        >
                          <Link
                            to={`/plants/${plant.id}/timestamps`}
                            className='text-white text-underline-hover nav-link'
                          >
                            Timestamps
                          </Link>
                        </Button>
                      </span>
                      <span className='nav-item'>
                        <Button>
                          <Link
                            to={`/plants/${plant.id}/periodstamps`}
                            className='text-white text-underline-hover nav-link'
                          >
                            Periodstamps
                          </Link>
                        </Button>
                      </span>
                    </div>
                  )}
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
