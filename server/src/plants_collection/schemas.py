from typing import Any, List
from pydantic import BaseModel
import datetime

from src.plants_collection.plants.schemas import PlantIdNameResponse


class PlantsCollectionBase(BaseModel):
    pass


class PlantsCollectionCreate(PlantsCollectionBase):
    name: str


class plantsCollectionUpdate(PlantsCollectionBase):
    name: str


class PlantsCollectionResponse(PlantsCollectionBase):
    id: str
    name: str
    count: int = 0
    created_at: datetime.datetime
    updated_at: datetime.datetime


class PlantsCollectionWithPlantsResponse(PlantsCollectionResponse):
    plants: List[PlantIdNameResponse]
