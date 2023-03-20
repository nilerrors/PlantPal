from fastapi import APIRouter, Depends, HTTPException, status, Response
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
    plant_data = await crud.get_plant_by_id(user_email, plant_id)

    if plant_data is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Plant with given id not found")

    return plant_data


@router.get('/{plant_id}/irrigation_time', response_model=schemas.PlantWithIrrigationStampsResponse)
async def get_plant_times(plant: schemas.PlantESPGet, Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    
    user_email = Authorize.get_jwt_subject()
    plant_data = await crud.get_plant_times(user_email, plant.id, plant.collection_id)

    if plant_data is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Plant with given id not found")

    return plant_data


@router.get('/{plant_id}/times', response_model=schemas.PlantWithIrrigationStampsResponse)
async def get_plant_times(plant: schemas.PlantGet, Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    
    user_email = Authorize.get_jwt_subject()
    plant_data = await crud.get_plant_times(user_email, plant.id, plant.collection_id)

    if plant_data is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Plant with given id not found")

    return plant_data


@router.get('/{plant_id}/timestamps', response_model=schemas.PlantWithTimeStampsResponse)
async def get_plant_timestamps(plant: schemas.PlantGet, Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    
    user_email = Authorize.get_jwt_subject()
    plant_data = await crud.get_plant_timestamps(user_email, plant.id, plant.collection_id)

    if plant_data is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Plant with given id not found")

    return plant_data


@router.get('/{plant_id}/periodstamps', response_model=schemas.PlantWithPeriodStampsResponse)
async def get_plant_periodstamps(plant: schemas.PlantGet, Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    
    user_email = Authorize.get_jwt_subject()
    plant_data = await crud.get_plant_periodstamps(user_email, plant.id, plant.collection_id)

    if plant_data is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Plant with given id not found")

    return plant_data


@router.get('/{plant_id}/irrigations_graph.svg')
async def get_plant_irrigations_graph(plant: schemas.PlantGet, Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    
    user_email = Authorize.get_jwt_subject()
    svg = await crud.get_plant_irrigation_graph(user_email, plant.id, plant.collection_id)

    if plant is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Plant with given id not found")

    return Response(svg, media_type='image/svg+xml')


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


@router.post("/irrigate")
async def plant_irrigation(irrigation: schemas.PlantIrrigation):
    plant_irrigated = await crud.irrigate_plant(irrigation)
    if not plant_irrigated:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Plant with given id and Chip ID not found")
    
    return {'message': 'Plant irrigated'}
