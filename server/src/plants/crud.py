from src.prisma import prisma
from src.utils import hasher
from src import auth
from . import schemas



async def get_plant(user_email: str, plant_id: str, plant_collection_name: str = "$Plants"):
    user = await auth.crud.get_user_by_email(user_email)
    if user is None:
        return None

    plant_collection = await prisma.plant_collection.find_first(where={
        'name': plant_collection_name,
        'user_id': user.id
    })

    return await prisma.plant.find_first(where={
        'id': plant_id,
        'collection_id': plant_collection.id,
    },
    include={
        'irrigations': {
            'take': 3
        }
    })


async def get_plants(user_email: str):
    user = await auth.crud.get_user_by_email(user_email)
    if user is None:
        return None

    return await prisma.plant.find_many(where={
        'user_id': user.id
    })


async def create_plant(user_email: str):
    user = await auth.crud.get_user_by_email(user_email)
    if user is None:
        return None

    created_plant = await prisma.plant.create()

    return created_plant


async def delete_plant(user_email: str, plant_id: str):
    plant = await get_plant(user_email, plant_id)
    if plant is None:
        return False
    
    deleted_plant = await prisma.plant.delete(where={
        'id': plant_id
    })

    return deleted_plant is not None


async def irrigate_plant(irrigation: schemas.PlantIrrigation):
    user = await auth.crud.get_user_by_email_password(irrigation.user_email, irrigation.user_password)
    if user is None:
        return None

    plant = await get_plant(user.email, irrigation.plant_id)
    if plant is None:
        return False

    plant_irrigation = await prisma.irrigation.create(data={
        'plant_id': plant.id
    })

    return plant_irrigation is not None
