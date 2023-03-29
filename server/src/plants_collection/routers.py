from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi_jwt_auth import AuthJWT
from . import plants, crud, schemas


router = APIRouter(prefix="/plants_collection")

router.include_router(plants.router)


@router.get('/', response_model=List[schemas.PlantsCollectionResponse])
async def get_plants_collections(Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()

    print(Authorize.get_jwt_subject())
    user_email = Authorize.get_jwt_subject()
    user_plants = await crud.get_plants_collections(user_email)

    return user_plants or []


@router.get('/{plant_collection_id}', response_model=schemas.PlantsCollectionWithPlantsResponse)
async def get_plants_collection(plant_collection_id: str, Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    
    user_email = Authorize.get_jwt_subject()
    plant_collection = await crud.get_plants_collection(user_email, plant_collection_id)

    if plant_collection is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Plant with given id not found")

    return plant_collection


@router.post("/", response_model=schemas.PlantsCollectionResponse)
async def create_plants_collection(plants_collection: schemas.PlantsCollectionCreate, Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()

    user_email = Authorize.get_jwt_subject()
    created_plant = await crud.create_plants_collection(user_email, plants_collection)

    if type(created_plant) == bool and not created_plant:
        raise HTTPException(status.HTTP_409_CONFLICT, "Name for plants collection is already used")
    elif created_plant is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User email and password do not correspond")

    return created_plant


@router.put('/{plant_collection_id}', response_model=schemas.PlantsCollectionResponse)
async def update_plants_collection(plant_collection_id: str, plant_collection: schemas.plantsCollectionUpdate, Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    user_email = Authorize.get_jwt_subject()

    updated_plant = await crud.update_plants_collection(user_email, plant_collection_id, plant_collection)
    if type(updated_plant) == bool and not updated_plant:
        raise HTTPException(status.HTTP_409_CONFLICT, "Name for plants collection is already used")
    elif updated_plant is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Plants collection with given id not found")

    return updated_plant


@router.delete("/{plant_collection_id}")
async def delete_plant(plant_collection_id: str, Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    
    user_email = Authorize.get_jwt_subject()
    plant_deleted = await crud.delete_plants_collection(user_email, plant_collection_id)

    if not plant_deleted:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Plants collection with given id not found")

    return {'message': 'Plants collection deleted'}

