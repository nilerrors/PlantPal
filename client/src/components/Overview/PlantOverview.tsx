import { useEffect, useState } from 'react'
import { Plant } from '../../types'
import { useAuthentication } from '../../contexts/AuthenticationContext'

type Props = {
  plant: Plant
}

export function PlantOverview({ plant }: Props) {
  const [loading, setLoading] = useState(true)
  const [currentMoisturePercentage, setCurrentMoisturePercentage] = useState<
    null | number
  >()
  const { useApi } = useAuthentication()

  useEffect(() => {
    setLoading(true)
    const current_moisture = async () => {
      if (plant == undefined) return
      const { res, data } = await useApi(`/plants/${plant.id}/current_moisture`)
      if (!res.ok) return
      setCurrentMoisturePercentage(data?.current_moisture?.percentage ?? null)
    }
    current_moisture().then(() => {
      setLoading(false)
    })
    const fetchCurrentMoisture = setInterval(current_moisture, 3000)
    return () => clearInterval(fetchCurrentMoisture)
  }, [])

  const moistureColor = () => {
    if (!currentMoisturePercentage) return
    if (plant.moisture_percentage_treshold + 5 < currentMoisturePercentage)
      return 'green'
    if (plant.moisture_percentage_treshold - 5 > currentMoisturePercentage)
      return 'red'
    return 'yellow'
  }

  return (
    <>
      {loading ? null : (
        <>
          {currentMoisturePercentage == null ? (
            <h1>Plant Not Setup</h1>
          ) : (
            <>
              <div>
                {currentMoisturePercentage != null ? (
                  <h4>
                    Current Moisture Percentage:{' '}
                    <div className='text-align-center'>
                      <h1
                        className='display-1'
                        style={{ fontSize: '10rem', color: moistureColor() }}
                      >
                        {currentMoisturePercentage.toString()}%
                      </h1>
                    </div>
                  </h4>
                ) : null}
              </div>
            </>
          )}
        </>
      )}
    </>
  )
}
