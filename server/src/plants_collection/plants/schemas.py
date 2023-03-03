import re
from pydantic import BaseModel, EmailStr, validator

class PlantBase(BaseModel):
    pass


class PlantCreate(PlantBase):
    email: EmailStr
    password: str
    chip_id: str

    @validator('chip_id')
    def validate_chip_id_format(cls, value):
        if len(value) != 16:
            raise ValueError('Chip ID must be a 16-digit hexadecimal number')
        try:
            int(value, 16)
        except ValueError:
            raise ValueError('Chip ID must be a hexadecimal number')

        return value


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
    chip_id: str

    @validator('chip_id')
    def validate_chip_id_format(cls, value):
        if len(value) != 16:
            raise ValueError('Chip ID must be a 16-digit hexadecimal number')
        try:
            int(value, 16)
        except ValueError:
            raise ValueError('Chip ID must be a hexadecimal number')

        return value
