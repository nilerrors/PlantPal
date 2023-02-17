import re
from pydantic import BaseModel, EmailStr, validator

class PlantBase(BaseModel):
    pass


class PlantCreate(PlantBase):
    mac_address: str
    name: str
    water_amount: int = 1000

    @validator('mac_address')
    def validate_mac_address(cls, value):
        if value is None:
            raise ValueError('mac_address must be provided')
        
        mac_address_regex = "^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})|([0-9a-fA-F]{4}\\.[0-9a-fA-F]{4}\\.[0-9a-fA-F]{4})$"

        if not re.search(re.compile(mac_address_regex), value):
            raise ValueError('mac_address must be valid')
        
        return value

    @validator('water_amount')
    def validate_range(cls, value):
        # Accepted range is: 0 -> 10 liters
        if value not in range(0, 10001):
            raise ValueError('value must be in range 0 to 10000')
        
        return value


class PlantIrrigation(PlantBase):
    plant_id: str
    user_email: EmailStr
    user_password: str
