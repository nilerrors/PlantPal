from src.utils import hasher
from . import schemas
from src.prisma import prisma


async def get_user(user_id: str):
    return await prisma.user.find_first(where={
        'id': user_id
    },
    include={
        'verification': True
    })


async def get_user_by_email(email: str):
    return await prisma.user.find_first(where={
        'email': email
    },
    include={
        'verification': True
    })


async def get_user_by_email_password(email: str, password: str):
    return await prisma.user.find_first(where={
        'email': email,
        'password': hasher.get_password_hash(password)
    },
    include={
        'verification': True
    })


async def create_user(user: schemas.UserSignup) -> dict | None:
    user_exists = await get_user_by_email(user.email) is not None
    if user_exists:
        return None

    created_user = await prisma.user.create(data={
        'email': user.email,
        'firstName': user.first_name,
        'lastName': user.last_name,
        'password': hasher.get_password_hash(user.password)
    })

    verification = await prisma.verification.create(data={
        'user': {
            'connect': {
                'id': created_user.id
            }
        }
    })

    return {
        'id': created_user.id,
        'email': created_user.email,
        'first_name': created_user.firstName,
        'last_name': created_user.lastName,
        'verified': verification.verified,
        'verification_id': verification.id
    }


async def verify_user(verification_id: str):
    return await prisma.verification.update(data={
        'verified': True,
    },
    where={
        'id': verification_id
    })


async def authenticate_user(user: schemas.UserLogin):
    db_user = await get_user_by_email(user.email)
    if db_user is None or not hasher.verify_password(user.password, db_user.password):
        return False
    return True


async def update_user(user: schemas.UserUpdate):
    updated_user = await prisma.user.update(data={
        'email': user.email,
        'firstName': user.first_name,
        'lastName': user.last_name,
    },
    where={
        'email': user.email
    },
    include={
        'verification': True
    })

    return updated_user


async def remove_user(user: schemas.UserRemove):
    delete_user = await get_user_by_email_password(user.email, user.password)
    if delete_user is None:
        return False

    deleted_user = await prisma.user.delete(where={
        'id': delete_user.id
    })

    return deleted_user is not None
