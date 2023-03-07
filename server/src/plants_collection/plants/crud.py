from src.prisma import prisma
from src import auth, plants_collection
from . import schemas


async def get_plant_collection(user_email: str, plant_collection_id: str):
    user = await auth.crud.get_user_by_email(user_email)
    if user is None:
        return None

    return await prisma.plantscollection.find_first(where={
        'id': plant_collection_id,
        'user_id': user.id
    })


async def get_plant_collection_by_name(user_email: str, plant_collection_name: str = "$Plants"):
    user = await auth.crud.get_user_by_email(user_email)
    if user is None:
        return None

    return await prisma.plantscollection.find_first(where={
        'name': plant_collection_name,
        'user_id': user.id
    })


async def get_plant_by_chip_id(plant_id: str, chip_id: str):
    return await prisma.plant.find_first(where={
        'id': plant_id,
        'chip_id': chip_id
    })

async def get_plant(user_email: str, plant_id: str, plant_collection_name: str = "$Plants"):
    user = await auth.crud.get_user_by_email(user_email)
    if user is None:
        return None

    plant_collection = await prisma.plantscollection.find_first(where={
        'name': plant_collection_name,
        'user_id': user.id
    })

    if plant_collection is None:
        return None

    return await prisma.plant.find_first(where={
        'id': plant_id,
        'collection_id': plant_collection.id,
    },
    include={
        'irrigations_record': {
            'take': 3
        }
    })


async def get_plants(user_email: str, collection_id: str):
    user = await auth.crud.get_user_by_email(user_email)
    if user is None:
        return None

    collection = await plants_collection.crud.get_plants_collection(user_email, collection_id)

    if collection is None:
        return None

    return await prisma.plant.find_many(where={
        'collection_id': collection.id,
    })


async def create_plant(plant: schemas.PlantCreate):
    print(plant.dict())
    user = await auth.crud.get_user_by_email_password(plant.email, plant.password)
    if user is None:
        return None

    standard_plant_collection = await get_plant_collection_by_name(user.email, "$Plants")

    if standard_plant_collection is None:
        return None

    created_plant = await prisma.plant.create({
        'collection_id': standard_plant_collection.id,
        'chip_id': plant.chip_id
    })

    return created_plant


async def delete_plant(user_email: str, plant_id: str, plant_collection_name: str = "$Plants"):
    plant = await get_plant(user_email, plant_id, plant_collection_name)
    if plant is None:
        return False
    
    deleted_plant = await prisma.plant.delete(where={
        'id': plant_id
    })

    return deleted_plant is not None


async def irrigate_plant(irrigation: schemas.PlantIrrigation):
    plant = await get_plant_by_chip_id(irrigation.plant_id, irrigation.chip_id)
    if plant is None:
        return False

    plant_irrigation = await prisma.irrigationrecord.create(data={
        'plant_id': plant.id,
        'water_amount': plant.water_amount
    })

    return plant_irrigation is not None
