import os
import sys
import socket
import secrets


if __name__ == '__main__':
    DEV = True

    CLIENT_PATH = os.curdir + '/client'
    ESP32_PATH  = os.curdir + '/plantpal'
    SERVER_PATH = os.curdir + '/server'
    IP_ADDRESS  = socket.gethostbyname(socket.gethostname())

    # client folder
    with open(CLIENT_PATH + '\.env', 'w') as f:
        f.write(f'VITE_API_BASE_URL="http://{IP_ADDRESS}:8000"\n')

    os.system(f'cd {CLIENT_PATH} && yarn')
    print('cd client && yarn start')

    # server folder
    with open(SERVER_PATH + '\.env', 'w') as f:
        text = f'AUTHJWT_SECRET_KEY="{secrets.token_hex()}"\n\n'
        text += 'MAIL_USERNAME="enayat.sabawoon@outlook.com"\n'
        text += 'MAIL_PASSWORD=""\n'
        text += 'MAIL_FROM="enayat.sabawoon@outlook.com"\n'
        text += 'MAIL_PORT=587\n'
        text += 'MAIL_SERVER=smtp.office365.com\n'
        text += 'MAIL_FROM_NAME="PlantPal"\n\n'
        text += 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/management"\n'
        f.write(text)

    os.system(f'cd {SERVER_PATH} && py -m venv venv && .\\venv\\Script\\Activate.ps1 && pip install -r deps.txt')

    ## Prisma
    os.system(f'cd {SERVER_PATH}/src/prisma && prisma generate && prisma migrate {"dev" if DEV else "prod"} --name=init')
