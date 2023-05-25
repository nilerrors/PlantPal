import { useEffect, useState } from 'react'
import { Collapse, Container } from 'react-bootstrap'
import { PlantsOverview } from '../components/Overview/PlantsOverview'
import { useAuthentication } from '../contexts/AuthenticationContext'
import { Plant } from '../types'

export function Plants() {
  document.title = 'Plants'
  const [loading, setLoading] = useState(true)
  const [plants, setPlants] = useState<Plant[]>([])

  const { useApi } = useAuthentication()

  useEffect(() => {
    setLoading(true)
    useApi('/plants/', { method: 'GET' })
      .then(({ res, data }) => data)
      .then((data) => {
        setPlants(data ?? [])
        console.log('')
        setLoading(false)
      })
  }, [])

  return (
    <Container className='bg-dark text-align-center'>
      <h3>Plants</h3>
      <hr />
      {loading ? null : (
        <>
          <Collapse in={true}>
            <div>
              {plants != undefined && plants.length > 0 ? (
                <>
                  <PlantsOverview
                    plants={plants}
                    removePlant={(id) =>
                      setPlants((plants) => plants.filter((p) => p.id != id))
                    }
                  />
                </>
              ) : (
                <h1 className='display-1'>No plants</h1>
              )}
            </div>
          </Collapse>
        </>
      )}
    </Container>
  )
}
