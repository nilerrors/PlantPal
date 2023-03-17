export type FormT<T> = {
  onChange: (event: React.ChangeEvent<any>) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>
  set: (_values: T) => void
  values: T
}

export type IrrigationRecord = {
  id: string
  water_amount: number
  at: Date
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
  periodstamp_times_a_week: number
  irrigation_type: string
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
