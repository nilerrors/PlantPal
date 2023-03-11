from prisma.errors import UniqueViolationError as PrismaUniqueViolationError
import pygal
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
        'collection': True
    })


async def get_plant_timestamps(user_email: str, plant_id: str, plant_collection_name: str = "$Plants"):
    plant = await get_plant(user_email, plant_id, plant_collection_name)
    if plant is None:
        return None

    return await prisma.plant.find_first(where={
        'id': plant.id,
    },
    include={
        'collection': True,
        'timestamps': True
    })


async def get_plant_periodstamps(user_email: str, plant_id: str, plant_collection_name: str = "$Plants"):
    plant = await get_plant(user_email, plant_id, plant_collection_name)
    if plant is None:
        return None

    return await prisma.plant.find_first(where={
        'id': plant.id,
    },
    include={
        'collection': True,
        'periodstamps': True
    })


async def get_plant_times(user_email: str, plant_id: str, plant_collection_name: str = "$Plants"):
    plant = await get_plant(user_email, plant_id, plant_collection_name)
    if plant is None:
        return None

    plant_data = await prisma.plant.find_first(where={
        'id': plant_id,
        'collection_id': plant_collection.id,
    },
    include={
        'collection': True,
        'timestamps': plant.irrigation_type == 'time',
        'periodstamps': plant.irrigation_type == 'period',
    })

    if plant.irrigation_type == 'time':
        return {
            **plant_data.dict(),
            'times': plant_data.timestamps
        }
    
    return {
        **plant_data.dict(),
        'times': plant_data.periodstamps
    }


async def get_plant_irrigation_graph(user_email: str, plant_id: str, plant_collection_name: str = "$Plants"):
    plant = await get_plant(user_email, plant_id, plant_collection_name)
    if plant is None:
        return None
    
    irrigation_records = await prisma.irrigationrecord.find_many(where={
        'plant_id': plant.id
    })

    # User pygal for generating charts :-> pygal.org
    records = map(lambda r: {
        'x': r.at.strftime('%Y-%m-%d %H:%M:%S'),
        'y': r.water_amount
    },
    irrigation_records)

    graph = Line(
        width = 1200,
        height = 600,
        explicit_size = True,
        style = pygal.style.Style(
            background='transparent',
            plot_background='transparent',
            foreground='#555',
            foreground_strong='#000',
            foreground_subtle='#555',
            opacity='.6',
            opacity_hover='.9',
            transition='400ms ease-in',
            colors=('#E853A0', '#E8537A', '#E95355', '#E87653', '#E89B53')
        )
    )
    graph.x_labels = [record['x'] for record in records]
    graph.add(f'Water Amount of {plant.name}', [record['y'] for record in records])
    graph.x_labels_major_count = 10
    graph.show_minor_x_labels = False

    return graph.render()


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
    
    try:
        created_plant = await prisma.plant.create({
            'collection_id': standard_plant_collection.id,
            'chip_id': plant.chip_id
        })
    except PrismaUniqueViolationError:
        return "chipid exists"

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
