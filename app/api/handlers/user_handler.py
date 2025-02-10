from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.services.user_service import UserService
from app.core.schemas.users import UserCreate, UserResponse
from app.core.db.database import get_db

class UserHandler:
    def __init__(self, user_service: UserService):
        self.user_service = user_service
        self.router = APIRouter()
        self._register_routes()

    def _register_routes(self):
        self.router.post("/", response_model=UserResponse)(self.create_user)
        self.router.get("/", response_model=list[UserResponse])(self.get_users)

    async def create_user(self, user: UserCreate, db: AsyncSession = Depends(get_db)):
        return await self.user_service.create_user(db, user)

    async def get_users(self, db: AsyncSession = Depends(get_db)):
        return await self.user_service.get_users(db)

    def get_router(self) -> APIRouter:
        return self.router
