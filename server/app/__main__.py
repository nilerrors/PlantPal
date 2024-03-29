import sys
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException

from . import routers, schemas
from .prisma import prisma

app = FastAPI(title='Management',
              description='Plant Watering Management System',
              version='1.0.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    settings = schemas.config.Settings()
    if '' in settings.dict().values():
        sys.exit('Invalid Config')

    print("Prisma Connected")
    await prisma.connect()


@app.on_event("shutdown")
async def shutdown():
    print("Prisma Disconnected")
    await prisma.disconnect()


@AuthJWT.load_config
def get_config():
    return schemas.config.Settings()


@app.exception_handler(AuthJWTException)
def authjwt_exception_handler(request: Request, exc: AuthJWTException):
    return JSONResponse(status_code=exc.status_code,
                        content={"detail": exc.message})


@app.get('/health')
def health_check():
    return 'hello world'


app.include_router(routers.auth.router, tags=["authentication"])
app.include_router(routers.plants.router, tags=["plants"])
