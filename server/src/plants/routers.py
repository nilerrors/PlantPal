from fastapi import APIRouter, Depends, HTTPException, status
from fastapi_jwt_auth import AuthJWT
from . import crud, schemas


router = APIRouter(prefix="/plants")


@router.get('/')
async def get_plants(Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()

    print(Authorize.get_jwt_subject())
    user_email = Authorize.get_jwt_subject()
    user_plants = await crud.get_plants(user_email)

    return {'plants': user_plants}


@router.get('/{plant_id}')
async def get_plant(plant_id: str, Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    
    user_email = Authorize.get_jwt_subject()
    plant = await crud.get_plant(user_email, plant_id)

    if plant is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Plant with given id not found")

    return plant.dict()


@router.post("/")
async def create_plant(plant: schemas.PlantCreate, Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()

    user_email = Authorize.get_jwt_subject()
    created_plant = await crud.create_plant(user_email, plant)
    
    if created_plant is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User email and password do not correspond")

    return created_plant.dict()


@router.delete("/")
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
    if plant_irrigated is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User email and password do not correspond")
    elif not plant_irrigated:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Plant with given id not found")
    
    return {'message': 'Plant irrigated'}
