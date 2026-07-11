from fastapi import APIRouter, Depends

from app.dependencies import get_current_user

from app.models.user import User

from app.schemas.profile import UserProfile

router = APIRouter(

    prefix="/profile",

    tags=["Profile"]

)


@router.get(

    "/me",

    response_model=UserProfile

)
def get_profile(

    current_user: User = Depends(get_current_user)

):

    return current_user
