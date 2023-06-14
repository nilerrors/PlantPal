import datetime
from prisma.models import Timestamp
from prisma.enums import DayOfWeek


def inttoweekday(day: int):
    match day:
        case 0:
            return DayOfWeek.monday
        case 1:
            return DayOfWeek.tuesday
        case 2:
            return DayOfWeek.wednesday
        case 3:
            return DayOfWeek.thursday
        case 4:
            return DayOfWeek.friday
        case 5:
            return DayOfWeek.saturday
        case 6:
            return DayOfWeek.sunday
        case _:
            return DayOfWeek.everyday


def weekdaytoint(weekday: DayOfWeek):
    match weekday:
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
        case DayOfWeek.everyday:
            return -1
        case _:
            return -1


def compare_today_to_weekday(weekday: str) -> bool:
    if weekday == "everyday":
        return True
    today = datetime.datetime.now().weekday()
    if inttoweekday(today) == weekday:
        return True
    
    return False


def compare_date(timestamp: Timestamp):
    if not compare_today_to_weekday(timestamp.day_of_week):
        return False
    
    return True

