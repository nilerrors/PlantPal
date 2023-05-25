import { DayOfWeek, TimeStamp } from '../types'

function dayOfWeekToInt(dayOfWeek: DayOfWeek): number {
  switch (dayOfWeek) {
    case DayOfWeek.everyday:
      return -1
    case DayOfWeek.monday:
      return 0
    case DayOfWeek.tuesday:
      return 1
    case DayOfWeek.wednesday:
      return 2
    case DayOfWeek.thursday:
      return 3
    case DayOfWeek.friday:
      return 4
    case DayOfWeek.saturday:
      return 5
    case DayOfWeek.sunday:
      return 6
    default:
      return -1
  }
}

export function compareTimestamps(t1: TimeStamp, t2: TimeStamp): number {
  if (dayOfWeekToInt(t1.day_of_week) < dayOfWeekToInt(t2.day_of_week)) return -1
  if (dayOfWeekToInt(t1.day_of_week) > dayOfWeekToInt(t2.day_of_week)) return 1
  if (t1.hour < t2.hour) return -1
  if (t1.hour > t2.hour) return 1
  if (t1.minute < t2.minute) return -1
  if (t1.minute > t2.minute) return 1
  return 0
}
