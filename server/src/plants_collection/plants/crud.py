from typing import List, Literal, TypedDict
from prisma.errors import UniqueViolationError as PrismaUniqueViolationError
from prisma.models import Timestamp
import pygal
import datetime
from src.utils.comparedatetime import compare_date, filter_timestamps, filter_periodstamps
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
    },
    include={
        'collection': True
    })


async def get_plant_by_id(user_email: str, plant_id: str):
    user = await auth.crud.get_user_by_email(user_email)
    if user is None:
        return None

    return await prisma.plant.find_first(where={
        'id': plant_id,
        'collection': {
            'is': {
                'user_id': user.id
            }
        }
    },
    include={
        'collection': True
    })


async def get_plant(user_email: str, plant_id: str):
    plant = await get_plant_by_id(user_email, plant_id)
    if plant is None or plant.collection is None:
        return None
    return plant


async def get_plant_timestamps(user_email: str, plant_id: str):
    plant = await get_plant_by_id(user_email, plant_id)
    if plant is None:
        return None

    return await prisma.plant.find_first(where={
        'id': plant.id,
    },
    include={
        'collection': True,
        'timestamps': True
    })


async def get_plant_periodstamps(user_email: str, plant_id: str):
    plant = await get_plant_by_id(user_email, plant_id)
    if plant is None:
        return None

    return await prisma.plant.find_first(where={
        'id': plant.id,
    },
    include={
        'collection': True,
        'periodstamps': True
    })


async def get_plant_times(user_email: str, plant_id: str):
    plant = await get_plant_by_id(user_email, plant_id)
    if plant is None:
        return None

    plant_data = await prisma.plant.find_first(where={
        'id': plant.id,
        'collection_id': plant.collection_id
    },
    include={
        'collection': True,
        'timestamps': plant.irrigation_type == 'time',
        'periodstamps': plant.irrigation_type == 'period',
    })
    if plant_data is None:
        return None

    if plant.irrigation_type == 'time':
        return {
            **plant_data.dict(),
            'times': plant_data.timestamps
        }
    
    return {
        **plant_data.dict(),
        'times': plant_data.periodstamps
    }


async def get_plant_today_times(plant_id: str, chip_id: str):
    plant = await get_plant_by_chip_id(plant_id, chip_id)
    if plant is None or plant.collection is None:
        return None

    plant_data = await prisma.plant.find_first(where={
        'id': plant.id,
        'collection_id': plant.collection_id
    },
    include={
        'collection': True,
        'timestamps': filter_timestamps(plant.irrigation_type == 'time'),
        'periodstamps': filter_periodstamps(plant.irrigation_type == 'period'),
    })
    if plant_data is None:
        return None
    

    if plant.irrigation_type == 'time':
        return plant_data.timestamps

    return plant_data.periodstamps



async def get_plant_today_next_time(plant_id: str, chip_id: str):
    times = await get_plant_today_times(plant_id, chip_id)
    if times is None:
        return None
    
    return times[0]


async def get_should_irrigate_now(plant_id: str, chip_id: str):
    plant = await get_plant_by_chip_id(plant_id, chip_id)
    if plant is None:
        return None
    time = await get_plant_today_next_time(plant_id, chip_id)
    if time is None:
        return None
    
    moisture = await prisma.moisturepercentagerecord.find_first(where={
        'plant': {
            'is': {
                'id': plant_id,
                'chip_id': chip_id
            }
        }
    },
    order={
        'at': 'desc'
    })
    
    now = datetime.datetime.now()
    threshold = plant.moisture_percentage_treshold
    if moisture is None:
        return time.hour == now.hour and time.minute == now.minute
    elif plant.auto_irrigation and moisture.percentage <= threshold:
        return True
    elif moisture.percentage <= threshold:
        return time.hour == now.hour and time.minute == now.minute

    return False


async def get_plant_irrigation_graph(user_email: str, plant_id: str):
    plant = await get_plant_by_id(user_email, plant_id)
    if plant is None:
        return None
    
    irrigation_records = await prisma.irrigationrecord.find_many(where={
        'plant_id': plant.id
    })

    # User pygal for generating charts :-> pygal.org
    records = list(map(
        lambda r: {
            'x': r.at.strftime('%Y-%m-%d %H:%M:%S'),
            'y': r.water_amount
        },
        irrigation_records
    ))

    graph = pygal.Line(
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
    graph.x_labels = list(map(lambda r: r['x'], records))
    graph.add(f'Water Amount of {plant.name}', list(map(lambda r: r['y'], records)))
    graph.x_labels_major_count = 10
    graph.show_minor_x_labels = False

    return graph.render_data_uri()


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


async def update_plant(user_email: str, plant_id: str, plant: schemas.PlantUpdate):
    _plant = await get_plant_by_id(user_email, plant_id)
    if _plant is None:
        return None
    
    return await prisma.plant.update(data={
        'name': plant.name,
        'water_amount': plant.water_amount,
        'auto_irrigation': plant.auto_irrigation,
        'irrigation_type': plant.irrigation_type,
        'moisture_percentage_treshold': plant.moisture_percentage_treshold,
        'periodstamp_times_a_week': plant.periodstamp_times_a_week
    },
    where={
        'id': _plant.id,
    })

async def delete_plant(user_email: str, plant_id: str):
    db_plant = await get_plant_by_id(user_email, plant_id)
    if db_plant is None:
        return False
    
    deleted_plant = await prisma.plant.delete(where={
        'id': db_plant.id
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
