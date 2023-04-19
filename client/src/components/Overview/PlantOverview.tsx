import React, { useEffect, useState } from 'react'
import { Plant } from '../../types'
import { waterAmountToLiter } from '../../utils/waterAmountToLiter'
import { useAuthentication } from '../../contexts/AuthenticationContext'
import { useLocation } from 'react-router-dom'
import { IrrigationsGraph } from '../Graphs/IrrigationsGraph'
import { MoisturePercentageGraph } from '../Graphs/MoisturePercentageGraph'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

type Props = {
  plant: Plant
}

export function PlantOverview({ plant }: Props) {
  const [currentMoisturePercentage, setCurrentMoisturePercentage] = useState<
    null | number
  >()
  const { useApi } = useAuthentication()

  useEffect(() => {
    const current_moisture = async () => {
      if (plant == undefined) return
      const { res, data } = await useApi(`/plants/${plant.id}/current_moisture`)
      if (!res.ok) return
      setCurrentMoisturePercentage(data?.current_moisture?.percentage ?? null)
    }
    current_moisture()
    const fetchCurrentMoisture = setInterval(current_moisture, 3000)
    return () => clearInterval(fetchCurrentMoisture)
  }, [])

  return (
    <>
      <div
        style={{ display: window.innerWidth > 700 ? 'flex' : undefined }}
        className='mt-5'
      >
        <div style={{ width: window.innerWidth > 700 ? '50%' : '100%' }}>
          {/* <h4>Name: {plant.name}</h4>
          <h4>Water Amount: {waterAmountToLiter(plant.water_amount)}</h4>
          <h4>ESP Chip ID: {plant.chip_id.toUpperCase()}</h4>
          <h4>Created At: {new Date(plant.created_at).toLocaleString()}</h4>
          {plant.created_at != plant.updated_at ? (
            <h4>Updated At: {new Date(plant.updated_at).toLocaleString()}</h4>
          ) : null}
          <h4>
            Auto-irrigation is turned {plant.auto_irrigation ? 'on' : 'off'}.
          </h4>
          <h4>Moisture Threshold: {plant.moisture_percentage_treshold}%</h4>
          <h4>Irrigation Type: {plant.irrigation_type}</h4>
          {plant.irrigation_type == 'period' ? (
            <h4>
              Amount of irrigations per week: {plant.periodstamp_times_a_week}{' '}
              times
            </h4>
          ) : null} */}
        </div>
        <div style={{ width: window.innerWidth > 700 ? '50%' : '100%' }}>
          {currentMoisturePercentage != null ? (
            <h4>
              Current Moisture Percentage:{' '}
              {/* <Doughnut
                options={{ backgroundColor: 'Blue' }}
                data={{
                  datasets: [
                    {
                      label: 'Moisture Percentage',
                      data: [currentMoisturePercentage, 100],
                      borderWidth: 1,
                    },
                  ],
                }}
              /> */}
              <h1 style={{ fontSize: 'large' }}>
                {currentMoisturePercentage.toString()}%
              </h1>
            </h4>
          ) : null}
        </div>
      </div>
      <div>
        <IrrigationsGraph plant_id={plant.id} />
        <MoisturePercentageGraph plant_id={plant.id} />
      </div>
    </>
  )
}
