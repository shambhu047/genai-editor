from fastapi import APIRouter, Depends, HTTPException
from fastapi.params import Param
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db.database import get_db
from app.core.services.collaboration_service import CollaborationService
from app.core.schemas.collaboration_schemas import CollaborationResponseSchema

class CollaborationHandler:
    def __init__(self, collaboration_service: CollaborationService):
        self.collaboration_service = collaboration_service
        self.router = APIRouter()
        self._register_routes()

    def _register_routes(self):
        self.router.post("/projects/{project_id}/collaborate", response_model=CollaborationResponseSchema)(
            self.collaborate
        )

    async def collaborate(
            self,
            project_id: int,
            user_id: str = Param("userId"),
            db: AsyncSession = Depends(get_db)
    ) -> CollaborationResponseSchema:
        try:
            return await self.collaboration_service.get_or_create_collaboration(db, project_id, user_id)
        except ValueError as e:
            raise HTTPException(status_code=500, detail=str(e))

    def get_router(self):
        return self.router
