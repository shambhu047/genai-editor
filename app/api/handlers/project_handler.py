from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db.database import get_db
from app.core.services.project_service import ProjectService
from app.core.schemas.project_schemas import ProjectSchema, DirectorySchema, FileSchema
from pydantic import BaseModel
from typing import List

class CreateProjectRequest(BaseModel):
    name: str

class CreateFileRequest(BaseModel):
    directory_id: int
    file_name: str
    content: str

class UpdateFileRequest(BaseModel):
    new_content: str

class CreateDirectoryRequest(BaseModel):
    parent_directory_id: int
    dir_name: str


class ProjectHandler:
    def __init__(self, project_service: ProjectService):
        self.project_service = project_service
        self.router = APIRouter()
        self._register_routes()

    def _register_routes(self):
        self.router.get("/projects", response_model=List[ProjectSchema])(self.list_projects)
        self.router.get("/projects/{project_id}", response_model=ProjectSchema)(self.get_project)
        self.router.get("/projects/{project_id}/structure", response_model=DirectorySchema)(self.get_project_structure)
        self.router.post("/projects", response_model=ProjectSchema)(self.create_project)

        self.router.post("/directories", response_model=DirectorySchema)(self.add_directory)
        self.router.delete("/directories/{directory_id}")(self.delete_directory)

        self.router.get("/files/{file_id}", response_model=FileSchema)(self.get_file_content)
        self.router.post("/files", response_model=FileSchema)(self.create_file)
        self.router.put("/files/{file_id}", response_model=FileSchema)(self.update_file)
        self.router.delete("/files/{file_id}")(self.delete_file)

    async def list_projects(
            self,
            db: AsyncSession = Depends(get_db)
    ) -> List[ProjectSchema]:
        return await self.project_service.list_projects(db)

    async def get_project(
            self,
            project_id: int,
            db: AsyncSession = Depends(get_db)
    ) -> ProjectSchema:
        project = await self.project_service.get_project(db, project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        return project

    async def get_project_structure(
            self,
            project_id: int,
            db: AsyncSession = Depends(get_db)
    ) -> DirectorySchema:
        root_directory = await self.project_service.get_project_structure(db, project_id)
        if not root_directory:
            raise HTTPException(status_code=404, detail="Project root directory not found")
        return root_directory

    async def create_project(
            self,
            request: CreateProjectRequest,
            db: AsyncSession = Depends(get_db)
    ) -> ProjectSchema:
        return await self.project_service.create_project(db, request.name)

    async def add_directory(
            self,
            request: CreateDirectoryRequest,
            db: AsyncSession = Depends(get_db)
    ) -> DirectorySchema:
        return await self.project_service.add_directory(
            db, request.parent_directory_id, request.dir_name
        )

    async def delete_directory(
            self,
            directory_id: int,
            db: AsyncSession = Depends(get_db)
    ) -> dict:
        success = await self.project_service.delete_directory(db, directory_id)
        if not success:
            raise HTTPException(status_code=404, detail="Directory not found")

        return {"message": "directory deleted"}

    async def get_file_content(
            self,
            file_id: int,
            db: AsyncSession = Depends(get_db)
    ) -> FileSchema:
        file = await self.project_service.get_file_content(db, file_id)
        if not file:
            raise HTTPException(status_code=404, detail="File not found")
        return file

    async def create_file(
            self,
            request: CreateFileRequest,
            db: AsyncSession = Depends(get_db)
    ) -> FileSchema:
        return await self.project_service.create_file(
            db,
            request.directory_id,
            request.file_name,
            request.content
        )

    async def update_file(
            self,
            file_id: int,
            request: UpdateFileRequest,
            db: AsyncSession = Depends(get_db)
    ) -> FileSchema:
        file = await self.project_service.update_file(db, file_id, request.new_content)
        if not file:
            raise HTTPException(status_code=404, detail="File not found")
        return file

    async def delete_file(
            self,
            file_id: int,
            db: AsyncSession = Depends(get_db)
    ) -> dict:
        success = await self.project_service.delete_file(db, file_id)
        if not success:
            raise HTTPException(status_code=404, detail="File not found")
        return {"message": "file deleted"}

    def get_router(self) -> APIRouter:
        return self.router
