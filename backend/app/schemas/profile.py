from pydantic import BaseModel


class UserProfile(BaseModel):

    id: int

    name: str

    email: str

    role: str

    class Config:

        from_attributes = True
