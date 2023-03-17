import React from 'react'
import { Plant } from '../../types'
import { waterAmountToLiter } from '../../utils/waterAmountToLiter'

type Props = {
  plant: Plant
}

export function PlantOverview({ plant }: Props) {
  return (
    <>
      <h4>Name:{plant.name}</h4>
      <h4>Water Amount: {waterAmountToLiter(plant.water_amount)}</h4>
      <h4>ESP Chip ID: {plant.chip_id}</h4>
      <h4>Created At: {new Date(plant.created_at).toLocaleString()}</h4>
      {plant.created_at != plant.updated_at ? (
        <h4>Updated At: {new Date(plant.updated_at).toLocaleString()}</h4>
      ) : null}
      <h4>Auto-irrigation is turned {plant.auto_irrigation ? 'on' : 'off'}.</h4>
    </>
  )
}
