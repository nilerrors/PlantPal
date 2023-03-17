from typing import Any, List
from pydantic import BaseModel
import datetime

from src.plants_collection.plants.schemas import PlantPackedResponse


class PlantsCollectionBase(BaseModel):
    pass


class PlantsCollectionCreate(PlantsCollectionBase):
    name: str


class PlantsCollectionResponse(PlantsCollectionBase):
    id: str
    name: str
    created_at: datetime.datetime
    updated_at: datetime.datetime


class PlantsCollectionWithPlantsResponse(PlantsCollectionResponse):
    plants: List[PlantPackedResponse]
