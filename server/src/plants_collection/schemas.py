from pydantic import BaseModel


class PlantsCollectionBase(BaseModel):
    pass


class PlantsCollectionCreate(PlantsCollectionBase):
    name: str


