from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from fastapi_jwt_auth import AuthJWT
from app.utils.send_email import send_email_async
from app import schemas, crud

router = APIRouter(prefix='/auth')


@router.post('/login')
async def login(user: schemas.auth.UserLogin, Authorize: AuthJWT = Depends()):
    auth_user = await crud.auth.auth.authenticate_user(user)
    if not auth_user:
        raise HTTPException(status.HTTP_404_NOT_FOUND,
                            'Email does not correspond with the password')

    db_user = await crud.auth.get_user_by_email(user.email)
    if not db_user or db_user.verification is None or not db_user.verification.verified:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED,
                            'Account is not verified')

    access_token = Authorize.create_access_token(subject=user.email,
                                                 expires_time=user.expires_time)
    return {'access_token': access_token}


@router.post('/signup', status_code=status.HTTP_201_CREATED)
async def signup(background_tasks: BackgroundTasks,
                 user: schemas.auth.UserSignup):
    created_user = await crud.auth.create_user(user)
    if created_user is None:
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            f"User with email-address '{user.email}' already exists.")

    background_tasks.add_task(
        send_email_async, 'Account Verification', user.email, {
            'title': 'Verify Account',
            'name': user.first_name,
            'user_id': created_user['id'],
            'code': created_user['verification_code']
        }, 'verify.html')

    return {
        'message': f'Verification email sent to {user.email}',
        'user': {
            'id': created_user['id']
        }
    }


@router.post('/user/verify/{user_id}/{code}')
async def verify_user(user_id: str, code: str, Authorize: AuthJWT = Depends()):
    verification_added = await crud.auth.verify_user(user_id, code)
    if verification_added == 'no account':
        raise HTTPException(status.HTTP_404_NOT_FOUND,
                            f"No account found with id '{user_id}'")
    if verification_added == 'wrong code':
        raise HTTPException(status.HTTP_406_NOT_ACCEPTABLE,
                            "Wrong verification code")
    if verification_added is None or verification_added.user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND,
                            f"No account found with id '{user_id}'")

    access_token = Authorize.create_access_token(
        subject=verification_added.user.email, expires_time=3600)
    return {'access_token': access_token}


@router.post("/user/resend_verification")
async def resend_verification(background_tasks: BackgroundTasks,
                              user: schemas.auth.UserResendVerification):
    db_user = await crud.auth.get_user_by_email(user.email)
    if db_user is None or db_user.verification is None:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            f"User with email-address '{user.email}' does not exist")

    if db_user.verification is not None and db_user.verification.verified:
        raise HTTPException(status.HTTP_208_ALREADY_REPORTED,
                            f"Account is already verified")

    background_tasks.add_task(
        send_email_async, 'Account Verification', user.email, {
            'title': 'Verify Account',
            'name': db_user.first_name,
            'user_id': db_user.id or "",
            'code': db_user.verification.code or ""
        }, 'verify.html')

    return {'message': f'Verification email sent to {user.email}'}


@router.post('/user_id')
async def get_user_id(user: schemas.auth.UserLogin):
    user_id = await crud.auth.get_user_by_email_password(
        user.email, user.password)
    if user_id is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, 'User does not exist')

    return {'user_id': user_id.id}


@router.get('/user/current')
async def current_user(Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()

    user = Authorize.get_jwt_subject()
    return {'current_user': user}


@router.get('/user', response_model=schemas.auth.UserResponse)
async def user(Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()

    user = await crud.auth.get_user_by_email(Authorize.get_jwt_subject())

    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, 'User does not exist')

    return {
        **user.dict(), "verified":
            True if user.verification is not None and user.verification.verified
            else False
    }


@router.put('/user', response_model=schemas.auth.UpdatedUserResponse)
async def update_user(user: schemas.auth.UserUpdate,
                      Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()

    user_email = Authorize.get_jwt_subject()
    if user.email != user_email:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED,
                            'Unauthorized to update account')
    updated = await crud.auth.update_user(user)
    if updated is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND,
                            'User with given email not found')

    return {
        "user":
            updated,
        "access_token":
            Authorize.create_access_token(subject=updated.email,
                                          expires_time=3600)
    }


@router.put('/user/password', response_model=schemas.auth.UpdatedUserResponse)
async def update_user_password(user: schemas.auth.UserUpdatePassword,
                               Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()

    user_email = Authorize.get_jwt_subject()
    if user.email != user_email:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED,
                            'Unauthorized to update account')
    updated = await crud.auth.update_user_password(user)
    if updated is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND,
                            'User with given email not found')

    return {
        "user":
            updated,
        "access_token":
            Authorize.create_access_token(subject=updated.email,
                                          expires_time=3600)
    }


@router.delete('/user')
async def delete_user(user: schemas.auth.UserRemove,
                      Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()

    user_email = Authorize.get_jwt_subject()
    if user.email != user_email:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED,
                            'Unauthorized to delete account')
    deleted = await crud.auth.remove_user(user)
    if not deleted:
        raise HTTPException(status.HTTP_404_NOT_FOUND,
                            'Email and password do not correspond')

    return {'message': 'Account deleted'}
