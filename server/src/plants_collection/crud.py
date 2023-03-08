from src.prisma import prisma
from src import auth
from . import schemas


async def get_plants_collections(user_email: str):
    user = await auth.crud.get_user_by_email(user_email)
    if user is None:
        return None

    return await prisma.plantscollection.find_many(where={
        'user_id': user.id
    })


async def get_plants_collection(user_email: str, plants_collection_id: str):
    user = await auth.crud.get_user_by_email(user_email)
    if user is None:
        return None

    return await prisma.plantscollection.find_first(where={
        'id': plants_collection_id,
        'user_id': user.id
    },
    include={
        'plants': True
    })


async def create_plants_collection(user_email: str, plants_collection: schemas.PlantsCollectionCreate):
    user = await auth.crud.get_user_by_email(user_email)
    if user is None:
        return None

    # Check whether there are other plants collections with the same name -> plants collection name should be unique
    if not await prisma.plantscollection.find_first(where={'name': plants_collection.name}) is None:
        return False

    return await prisma.plantscollection.create({
        'name': plants_collection.name
    })

async def delete_plants_collection(user_email: str, plants_collection_id: str):
    user = await auth.crud.get_user_by_email(user_email)
    if user is None:
        return None

    plantscollection = await prisma.plantscollection.find_first(where={
        'id': plants_collection_id,
        'name': {
            'not': "$Plants"
        },
        'user_id': user.id,
    })

    if plantscollection is None:
        return None

    return await prisma.plantscollection.delete({
        'id': plantscollection.id,
    })
