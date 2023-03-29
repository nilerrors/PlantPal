from src.prisma import prisma
from src import auth
from . import schemas


async def get_plants_count_by_collection_id(collection_id: str):
    return await prisma.plant.count(where={
        'collection_id': collection_id
    }) or 0


async def get_plants_collections(user_email: str):
    user = await auth.crud.get_user_by_email(user_email)
    if user is None:
        return None

    collections = await prisma.plantscollection.find_many(where={
        'user_id': user.id,
    })
    if collections is None:
        return []
    
    return [({
        **c.dict(),
        'count': await get_plants_count_by_collection_id(c.id)
    }) for c in collections]


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
        'name': plants_collection.name,
        'user_id': user.id
    })


async def update_plants_collection(user_email: str, plants_collection_id: str, plants_collection: schemas.plantsCollectionUpdate):
    user = await auth.crud.get_user_by_email(user_email)
    if user is None:
        return None

    # Check whether there are other plants collections with the same name -> plants collection name should be unique
    if not await prisma.plantscollection.find_first(where={'name': plants_collection.name}) is None:
        return False

    _plants_collection = await get_plants_collection(user_email, plants_collection_id)
    if _plants_collection is None:
        return None

    updated_plants_collection = await prisma.plantscollection.update({
        'name': plants_collection.name,
    },
    where={
        'id': _plants_collection.id,
    })
    if updated_plants_collection is None:
        return None

    return {
        **updated_plants_collection.dict(),
        "count": await get_plants_count_by_collection_id(updated_plants_collection.id)
    }


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
