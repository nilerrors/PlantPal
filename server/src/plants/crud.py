from src.prisma import prisma
from src.utils import hasher
from src import auth
from . import schemas



async def get_plant(user_email: str, plant_id: str):
    user = await auth.crud.get_user_by_email(user_email)
    if user is None:
        return None

    return await prisma.plant.find_first(where={
        'id': plant_id,
        'userId': user.id
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
        'userId': user.id
    })


async def create_plant(user_email: str, plant: schemas.PlantCreate):
    user = await auth.crud.get_user_by_email(user_email)
    if user is None:
        return None

    created_plant = await prisma.plant.create(data={
        'macAddress': plant.mac_address,
        'name': plant.name,
        'waterAmount': plant.water_amount,
        'user': {
            'connect': {
                'id': user.id
            }
        }
    })

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
        'plant': {
            'connect': {
                'id': plant.id
            }
        }
    })

    return plant_irrigation is not None
