export type IrrigationRecord = {
  id: string
  water_amount: number
  at: Date
}

export enum IrrigationType {
  time,
  period,
}

export enum DayOfWeek {
  monday,
  tuesday,
  wednesday,
  thursday,
  friday,
  saturday,
  sunday,
  everyday,
}

export type TimeStamp = {
  id: string
  day_of_week: DayOfWeek
  hour: number
  minute: number
  second: number
}

export type Plant = {
  id: string
  chip_id: string
  name: string
  water_amount: number
  created_at: Date
  updated_at: Date
  auto_irrigation: boolean
  irrigation_type: IrrigationType
  irrigations_record: IrrigationRecord[]
  timestamps: TimeStamp[]

  collection?: PlantsCollection
}

export type PlantsCollection = {
  id: string
  name: string
  created_at: Date
  updated_at: Date
  plants?: Plant[]
}
