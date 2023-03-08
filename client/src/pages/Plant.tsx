import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { Navigate, useParams } from 'react-router-dom'
import { useAuthentication } from '../contexts/AuthenticationContext'
import { Plant } from '../types'

export function Plant() {
  const [plant, setPlant] = useState<Plant>()
  const [error, setError] = useState<string | null>(null)
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
      .then((data) => setPlant(data))
  }, [])

  return (
    <Container className='bg-dark text-align-center'>
      <h3>
        '{plant?.name}' in {plant?.collection?.name}
      </h3>
      <hr />
      {error != null ? (
        <>{error}</>
      ) : (
        <pre>{JSON.stringify(plant, undefined, 2)}</pre>
      )}
    </Container>
  )
}
