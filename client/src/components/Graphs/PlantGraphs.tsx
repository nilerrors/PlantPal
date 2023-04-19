import { IrrigationsGraph } from './IrrigationsGraph'
import { MoisturePercentageGraph } from './MoisturePercentageGraph'

type Props = {
  id: string
}

export function PlantGraphs({ id }: Props) {
  return (
    <>
      <div>
        <IrrigationsGraph plant_id={id} />
        <MoisturePercentageGraph plant_id={id} />
      </div>
    </>
  )
}
