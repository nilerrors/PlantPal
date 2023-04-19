import { useEffect, useState } from 'react'
import { Collapse, Container } from 'react-bootstrap'
import { PlantsOverview } from '../components/Overview/PlantsOverview'
import { useAuthentication } from '../contexts/AuthenticationContext'
import { Plant } from '../types'

export function Plants() {
  document.title = 'Plants'
  const [plants, setPlants] = useState<Plant[]>([])

  const { useApi } = useAuthentication()

  useEffect(() => {
    useApi('/plants/', { method: 'GET' })
      .then(({ res, data }) => data)
      .then((data) => {
        setPlants(data ?? [])
        console.log('')
      })
  }, [])

  return (
    <Container className='bg-dark text-align-center'>
      <h3>Plants</h3>
      <hr />
      <Collapse in={true}>
        <div>
          <PlantsOverview
            plants={plants}
            removePlant={(id) =>
              setPlants((plants) => plants.filter((p) => p.id != id))
            }
          />
        </div>
      </Collapse>
    </Container>
  )
}
