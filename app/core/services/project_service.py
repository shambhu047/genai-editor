from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from sqlalchemy.orm import selectinload
from app.core.db.models import Project, Directory, File
from app.core.schemas.project_schemas import ProjectSchema, DirectorySchema, FileSchema

class ProjectService:
    async def list_projects(self, db: AsyncSession) -> List[ProjectSchema]:
        result = await db.execute(select(Project))
        projects = result.scalars().all()
        return [ProjectSchema.model_validate(project) for project in projects]

    async def get_project(
            self,
            db: AsyncSession,
            project_id: int
    ) -> Optional[ProjectSchema]:
        result = await db.execute(select(Project).where(Project.id == project_id))
        project = result.scalars().first()
        if not project:
            return None
        return ProjectSchema.model_validate(project)

    async def get_project_structure(
        self, db: AsyncSession, project_id: int
    ) -> DirectorySchema:
        stmt = (
            select(Directory)
            .options(
                selectinload(Directory.subdirectories).selectinload(Directory.files),
                selectinload(Directory.files)  # Fully preload files
            )
            .join(Project, Directory.id == Project.root_directory_id)
            .where(Project.id == project_id)
        )

        result = await db.execute(stmt)
        root_directory = result.unique().scalar_one_or_none()

        if not root_directory:
            return DirectorySchema(id=0, name="Empty", subdirectories=[], files=[])

        return await self._build_directory_structure(root_directory)

    async def _build_directory_structure(self, directory: Directory) -> DirectorySchema:
        return DirectorySchema(
            id=directory.id,
            name=directory.name,
            subdirectories=[
                await self._build_directory_structure(subdir) for subdir in directory.subdirectories
            ],
            files=[{"id": file.id, "name": file.name} for file in directory.files]
        )

    async def create_project(self, db: AsyncSession, name: str) -> ProjectSchema:
        try:
            async with db.begin():
                root_directory = Directory(name=f"{name}_root")
                db.add(root_directory)
                await db.flush()

                project = Project(name=name, root_directory_id=root_directory.id)
                db.add(project)
                await db.flush()

            await db.refresh(project)
            return ProjectSchema.model_validate(project)

        except Exception as e:
            await db.rollback()
            raise ValueError(f"Error creating project: {str(e)}")

    async def add_directory(
            self,
            db: AsyncSession,
            parent_directory_id: int,
            dir_name: str
    ) -> DirectorySchema:
        directory = Directory(name=dir_name, parent_directory_id=parent_directory_id)
        db.add(directory)
        await db.commit()
        await db.refresh(directory)
        return DirectorySchema.model_validate(directory)

    async def delete_directory(self, db: AsyncSession, directory_id: int) -> bool:
        result = await db.execute(select(Directory).where(Directory.id == directory_id))
        directory = result.scalars().first()
        if directory:
            await db.delete(directory)
            await db.commit()
            return True
        return False

    async def get_file_content(self, db: AsyncSession, file_id: int) -> Optional[FileSchema]:
        result = await db.execute(select(File).where(File.id == file_id))
        file = result.scalars().first()
        if not file:
            return None
        return FileSchema.model_validate(file)

    async def create_file(
            self,
            db: AsyncSession,
            directory_id: int,
            file_name: str,
            content: str
    ) -> FileSchema:
        file = File(name=file_name, content=content, directory_id=directory_id)
        db.add(file)
        await db.commit()
        await db.refresh(file)
        return FileSchema.model_validate(file)

    async def update_file(
            self,
            db: AsyncSession,
            file_id: int,
            new_content: str
    ) -> Optional[FileSchema]:
        result = await db.execute(select(File).where(File.id == file_id))
        file = result.scalars().first()
        if file:
            file.content = new_content
            await db.commit()
            return FileSchema.model_validate(file)
        return None

    async def delete_file(
            self,
            db: AsyncSession,
            file_id: int
    ) -> bool:
        result = await db.execute(select(File).where(File.id == file_id))
        file = result.scalars().first()
        if file:
            await db.delete(file)
            await db.commit()
            return True

        return False
