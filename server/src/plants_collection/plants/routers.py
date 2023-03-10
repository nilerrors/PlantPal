from fastapi import APIRouter, Depends, HTTPException, status
from fastapi_jwt_auth import AuthJWT
from . import crud, schemas


router = APIRouter(prefix="/plants")


@router.get('/', response_model=schemas.PlantResponse)
async def get_plants(collection_id: str, Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()

    print(Authorize.get_jwt_subject())
    user_email = Authorize.get_jwt_subject()
    user_plants = await crud.get_plants(user_email, collection_id)

    return {'plants': user_plants}


@router.get('/{plant_id}', response_model=schemas.PlantResponse)
async def get_plant(plant_id: str, Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    
    user_email = Authorize.get_jwt_subject()
    plant = await crud.get_plant(user_email, plant_id)

    if plant is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Plant with given id not found")

    return plant.dict()


@router.post("/")
async def create_plant(plant: schemas.PlantCreate):
    created_plant = await crud.create_plant(plant)
    
    if created_plant is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User email and password do not correspond")
    elif created_plant == 'chipid exists':
        raise HTTPException(status.HTTP_409_CONFLICT, "ESP with given Chip ID already exists")

    return created_plant.dict()


@router.delete("/{plant_id}")
async def delete_plant(plant_id: str, Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    
    user_email = Authorize.get_jwt_subject()
    plant_deleted = await crud.delete_plant(user_email, plant_id)

    if not plant_deleted:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Plant with given id not found")

    return {'message': 'Plant deleted'}


@router.post("/{plant_id}/irrigate")
async def plant_irrigation(irrigation: schemas.PlantIrrigation):
    plant_irrigated = await crud.irrigate_plant(irrigation)
    if not plant_irrigated:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Plant with given id and Chip ID not found")
    
    return {'message': 'Plant irrigated'}
