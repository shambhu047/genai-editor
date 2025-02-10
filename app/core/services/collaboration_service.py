from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.db.models import Collaboration
from app.core.schemas.collaboration_schemas import CollaborationResponseSchema
from sqlalchemy.exc import SQLAlchemyError
from typing import List


class CollaborationService:
    async def get_or_create_collaboration(
            self, db: AsyncSession,
            project_id: int,
            user_id: str
    ) -> CollaborationResponseSchema:
        stmt = select(Collaboration).where(Collaboration.project_id == project_id)
        result = await db.execute(stmt)
        collaborations = result.scalars().all()

        if collaborations:
            return CollaborationResponseSchema(
                id=collaborations[0].id,
                project_id=project_id,
                users=[c.user_id for c in collaborations]
            )

        try:
            collaboration = Collaboration(project_id=project_id, user_id=user_id)
            db.add(collaboration)
            await db.commit()
            await db.refresh(collaboration)

            return CollaborationResponseSchema(
                id=collaboration.id,
                project_id=project_id,
                users=[user_id]
            )

        except SQLAlchemyError as e:
            await db.rollback()
            raise ValueError(f"Error creating collaboration: {str(e)}")
