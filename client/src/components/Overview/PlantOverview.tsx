import React, { useEffect, useState } from 'react'
import { Plant } from '../../types'
import { waterAmountToLiter } from '../../utils/waterAmountToLiter'
import { useAuthentication } from '../../contexts/AuthenticationContext'
import { useLocation } from 'react-router-dom'

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
      const res = await useApi(
        `/plants_collection/plants/${plant.id}/current_moisture`
      )
      if (!res.ok) return
      const data = await res.json()
      setCurrentMoisturePercentage(data?.current_moisture ?? null)
    }
    current_moisture()
    const fetchCurrentMoisture = setInterval(current_moisture, 3000)
    return () => clearInterval(fetchCurrentMoisture)
  }, [])

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '50%' }}>
        <h4>Name: {plant.name}</h4>
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
        ) : null}
      </div>
      <div style={{ width: '50%' }}>
        {currentMoisturePercentage != null ? (
          <h4>
            Current Moisture Percentage: {currentMoisturePercentage.toString()}
          </h4>
        ) : null}
      </div>
    </div>
  )
}
