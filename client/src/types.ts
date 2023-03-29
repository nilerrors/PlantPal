export type FormT<T> = {
  onChange: (event: React.ChangeEvent<any>) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>
  set: (_values: T) => void
  values: T
  loading: boolean
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
}

export type Plant = {
  id: string
  chip_id: string
  name: string
  water_amount: number
  created_at: Date
  updated_at: Date
  auto_irrigation: boolean
  moisture_percentage_treshold: number
  periodstamp_times_a_week: number
  irrigation_type: string
  irrigations_record: IrrigationRecord[]
  timestamps: TimeStamp[]

  collection?: PlantsCollection
  collection_id?: string
}

export type PlantsCollection = {
  id: string
  name: string
  count: number
  created_at: Date
  updated_at: Date
}

export type User = {
  id: string
  email: string
  first_name: string
  last_name: string
  verified: boolean
  created_at: Date
  updated_at: Date
}
