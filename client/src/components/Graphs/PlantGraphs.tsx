import { IrrigationsGraph } from './IrrigationsGraph'
import { MoisturePercentageGraph } from './MoisturePercentageGraph'

type Props = {
  id: string
}

export function PlantGraphs({ id }: Props) {
  return (
    <>
      <div
        style={{
          width: window.innerWidth < 600 ? '100%' : undefined,
          marginInline: window.innerWidth < 600 ? -30 : undefined,
        }}
      >
        <IrrigationsGraph plant_id={id} />
        <MoisturePercentageGraph plant_id={id} />
      </div>
    </>
  )
}
