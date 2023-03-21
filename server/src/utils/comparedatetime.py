import datetime
from prisma.models import Timestamp
from prisma.types import FindManyTimestampArgsFromPlant, FindManyPeriodstampArgsFromPlant


weekdays = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
]

def inttoweekday(day: int):
    return weekdays[day]

def weekdaytoint(weekday: str):
    return weekdays.index(weekday)


def compare_today_to_weekday(weekday: str) -> bool:
    if weekday == "everyday":
        return True
    today = datetime.datetime.now().weekday()
    if weekdays[today] == weekday:
        return True
    
    return False


def compare_date(timestamp: Timestamp):
    if not compare_today_to_weekday(timestamp.day_of_week):
        return False
    
    return True


def stamps_args_today(now: datetime.datetime):
    return {
        'order_by': [
            {
                'hour': 'asc',
            },
            {
                'minute': 'asc',
            },
        ],
        'where': {
            'day_of_week': {
                'eq': inttoweekday(now.weekday())
            },
            'hour': {
                'gte': now.hour,
            },
            'minute': {
                'gte': now.minute,
            }
        }
    }


def filter_timestamps(condition: bool, now: datetime.datetime = datetime.datetime.now()) -> bool | FindManyTimestampArgsFromPlant:
    if not condition:
        return False
    
    return stamps_args_today(now)


def filter_periodstamps(condition: bool, now: datetime.datetime = datetime.datetime.now()) -> bool | FindManyPeriodstampArgsFromPlant:
    if not condition:
        return False
    
    return stamps_args_today(now)

