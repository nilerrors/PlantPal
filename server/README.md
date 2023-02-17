# Management

## Start Serve

```Powershell
uvicorn api:app --reload --host 0.0.0.0 --ssl-keyfile .\key.pem --ssl-certfile .\cert.pem
```

## Setup

### Environment

```Powershell
py -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r deps.txt
```

### .env

```
#
# api
#

HOST='localhost'
PORT=8000
SSL_CERTFILE='./cert.pem'
SSL_KEYFILE='./key.pem'

```

```
#
# api_v1
#

MAIL_USERNAME=""
MAIL_PASSWORD=""
MAIL_FROM=""
MAIL_PORT=587
MAIL_SERVER=smtp.office365.com
MAIL_FROM_NAME=""

# Database
DB_USER='postgres'
DB_PASS='postgres'
DB_SERVER='localhost:5432'
DB_NAME='management'

```

### Database

```Powershell
# Generate
prisma generate --schema=.\src\prisma\schema.prisma

# Migrate dev
prisma migrate dev --name=init --schema=.\src\prisma\schema.prisma

# Migrate prod
prisma migrate prod --name=init --schema=.\src\prisma\schema.prisma
```
