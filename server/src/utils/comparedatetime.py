import datetime
from prisma.models import Timestamp


weekdays = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
]

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
