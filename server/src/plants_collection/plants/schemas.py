from typing import Any, List
import datetime
from pydantic import BaseModel, EmailStr, validator


class PlantBase(BaseModel):
    pass


class ChipID(str):
    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type='string', format='hex16')

    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, value):
        if len(value) != 16:
            raise ValueError('Chip ID must be a 16-digit hexadecimal number')
        try:
            int(value, 16)
        except ValueError:
            raise ValueError('Chip ID must be a hexadecimal number')

        return value


class PlantGet(PlantBase):
    id: str
    collection_id: str


class PlantCreate(PlantBase):
    email: EmailStr
    password: str
    chip_id: ChipID


class PlantUpdate(PlantBase):
    name: str = "New Plant"
    water_amount: int = 1000

    @validator('water_amount')
    def validate_range(cls, value):
        # Accepted range is: 0 -> 10 liters
        if value not in range(0, 10001):
            raise ValueError('value must be in range 0 to 10000')
        
        return value


class PlantIrrigation(PlantBase):
    plant_id: str
    chip_id: ChipID
    

class PlantResponse(PlantBase):
    id: str
    chip_id: ChipID
    name: str
    water_amount: int
    created_at: datetime.datetime
    updated_at: datetime.datetime
    auto_irrigation: bool
    irrigation_type: str
    periodstamp_times_a_week: int = 0
    collection: Any = None


class TimeStamp(BaseModel):
    id: str
    day_of_week: str
    hour: int
    minute: int
    second: int


class PlantWithTimeStampsResponse(PlantResponse):
    timestamps: List[TimeStamp]


class PeriodStamp(BaseModel):
    id: str
    day_of_week: str
    hour: int
    minute: int
    second: int


class PlantWithPeriodStampsResponse(PlantResponse):
    periodstamps: List[TimeStamp]
    

class PlantWithIrrigationStampsResponse(PlantResponse):
    stamps: List[TimeStamp]
