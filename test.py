import requests
import time
import random
import json


while True:
    time.sleep(1)
    r = requests.post(f"http://localhost:8000/plants_collection/plants/current_moisture/{random.randint(0, 100)}", data=json.dumps({
        'plant_id': 'clg2f9be00004uri8w1t60ujx',
        'chip_id': '802c30e0aa4e1079'
    }))

    print(r.json())

