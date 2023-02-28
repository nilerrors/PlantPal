import re
from pydantic import BaseModel, EmailStr, validator

class PlantBase(BaseModel):
    pass


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
