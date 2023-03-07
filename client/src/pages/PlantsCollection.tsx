import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { Navigate, useParams } from 'react-router-dom'
import { useAuthentication } from '../contexts/AuthenticationContext'
import { PlantsCollection } from '../types'

export function PlantsCollection() {
  const { id } = useParams()
  const { useApi } = useAuthentication()
  const [plantsCollection, setPlantsCollection] = useState<PlantsCollection>()

  if (id === undefined) {
    return <Navigate to='/' />
  }

  useEffect(() => {
    useApi(`/plants_collection/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPlantsCollection(data)
      })
  }, [])

  return (
    <Container className='bg-dark text-align-center'>
      <pre>{JSON.stringify(plantsCollection, undefined, 2)}</pre>
    </Container>
  )
}
