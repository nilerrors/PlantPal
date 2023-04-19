import requests
import time
import random
import json


while True:
    time.sleep(1)
    r = requests.post(f"http://localhost:8000/plants/current_moisture/{random.randint(30, 60)}", data=json.dumps({
        'plant_id': 'clgnfzsyo0004gsr87cx84sp9',
        'chip_id': '7f08b698ff077190'
    }))

    print(r.json())


