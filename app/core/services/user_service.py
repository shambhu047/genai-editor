from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.db.models import User
from app.core.schemas.users import UserCreate

class UserService:
    async def create_user(self, db: AsyncSession, user_data: UserCreate) -> User:
        new_user = User(name=user_data.name, email=user_data.email)
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        return new_user

    async def get_users(self, db: AsyncSession):
        result = await db.execute(select(User))
        return result.scalars().all()
