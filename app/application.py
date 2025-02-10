import os
from fastapi import FastAPI, APIRouter
from functools import cached_property
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from requests import Request
from starlette.responses import JSONResponse

from app.api.handlers.v1_handler import V1Handler
from app.core.collaboration.hub import CollaborationHubOverNats
from app.core.services.collaboration_service import CollaborationService
from app.core.services.project_service import ProjectService
from app.core.services.user_service import UserService
from app.core.db.database import engine, Base


class Application:
    def __init__(self):
        self._app = FastAPI(title="GenAI Code Editor", version="1.0")
        self._configure_cors()
        self._setup_static_routes()

        self._setup_error_handler()

    def init_app(self) -> FastAPI:
        self._app.include_router(self.v1_router)
        self._app.add_event_handler("startup", self._on_start)
        return self._app

    async def _on_start(self):
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        await self.collaboration_hub.connect()

    def _configure_cors(self):
        self._app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    def _setup_static_routes(self):
        static_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../static/ui"))

        if os.path.exists(static_dir):
            self._app.mount("/ui", StaticFiles(directory=static_dir, html=True), name="ui")
            print(f"Serving UI from: {static_dir}")

    def _setup_error_handler(self):
        static_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../static/ui"))
        index_path = os.path.join(static_dir, "index.html")

        @self._app.exception_handler(404)
        async def custom_404_handler(request: Request, exc):
            if request.url.path.startswith("/ui/"):
                if os.path.exists(index_path):
                    return FileResponse(index_path)

            return JSONResponse({"detail": "Not Found"}, status_code=404)

    @cached_property
    def user_service(self) -> UserService:
        return UserService()

    @cached_property
    def project_service(self) -> ProjectService:
        return ProjectService()

    @cached_property
    def collaboration_service(self) -> CollaborationService:
        return CollaborationService()

    @cached_property
    def collaboration_hub(self) -> CollaborationHubOverNats:
        return CollaborationHubOverNats()

    @cached_property
    def v1_handler(self) -> V1Handler:
        return V1Handler(
            user_service=self.user_service,
            project_service=self.project_service,
            collaboration_service=self.collaboration_service
        )

    @cached_property
    def v1_router(self) -> APIRouter:
        return self.v1_handler.get_router()
