from fastapi import APIRouter

from app.api.handlers.collaboration_handler import CollaborationHandler
from app.api.handlers.project_handler import ProjectHandler
from app.core.services.collaboration_service import CollaborationService
from app.core.services.project_service import ProjectService
from app.core.services.user_service import UserService
from app.api.handlers.user_handler import UserHandler

class V1Handler:
    def __init__(
            self,
            user_service: UserService,
            project_service: ProjectService,
            collaboration_service: CollaborationService,
    ):
        self.user_service = user_service
        self.project_service = project_service
        self.collaboration_service = collaboration_service
        self.router = APIRouter(prefix="/v1")
        self._register_routes()

    def _register_routes(self):
        user_handler = UserHandler(self.user_service)
        project_handler = ProjectHandler(self.project_service)
        collaboration_handler = CollaborationHandler(self.collaboration_service)
        self.router.include_router(user_handler.get_router(), prefix="/users", tags=["Users"])
        self.router.include_router(project_handler.get_router(), prefix="", tags=["Projects"])
        self.router.include_router(collaboration_handler.get_router(), prefix="", tags=["Collaborations"])

    def get_router(self) -> APIRouter:
        return self.router
