import { useEffect, useState } from 'react'
import { Button, Container } from 'react-bootstrap'
import { Navigate, useParams } from 'react-router-dom'
import { PlantsCollectionOverview } from '../components/Overview/PlantsCollectionOverview'
import { useAuthentication } from '../contexts/AuthenticationContext'
import { PlantsCollection } from '../types'

export function PlantsCollection() {
  const { id } = useParams()
  const { useApi } = useAuthentication()
  const [plantsCollection, setPlantsCollection] =
    useState<PlantsCollection | null>(null)

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
      {plantsCollection != null ? (
        <>
          <h3>
            {plantsCollection?.name}
            {/* <Button
              onClick={() => setOpenForm(!openForm)}
              style={{ float: 'right' }}
            >
              {openForm ? 'Close Form' : 'Change'}
            </Button> */}
          </h3>
          <hr />
          <PlantsCollectionOverview plantsCollection={plantsCollection} />
          <pre>{JSON.stringify(plantsCollection, undefined, 2)}</pre>
        </>
      ) : null}
    </Container>
  )
}
