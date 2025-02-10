import asyncio
import logging
import json
from nats.aio.client import Client as NATS
from functools import cached_property
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.collaboration.schemas import CollaborationMessage, FileCreatedData, DirectoryCreatedData, FileUpdatedData
from app.core.services.project_service import ProjectService
from app.core.db.database import AsyncSessionLocal
from app.core.schemas.project_schemas import FileSchema, DirectorySchema


LOG = logging.getLogger()

class CollaborationHubOverNats:
    COLLAB_HUB_SUBJECT = "editor.v1.collaboration.hub"
    NATS_SERVER = "nats://nats:4222"

    def __init__(self):
        self.nats_client = NATS()
        self.project_service = ProjectService()

    async def connect(self):
        if not self.nats_client.is_connected:
            await self.nats_client.connect(self.NATS_SERVER)

        await self.nats_client.subscribe(self.COLLAB_HUB_SUBJECT, cb=self.message_handler)
        LOG.info(f"Subscribed to {self.COLLAB_HUB_SUBJECT}")

    async def message_handler(self, msg):
        data = CollaborationMessage(**json.loads(msg.data.decode()))
        collaboration_id = data.collaborationId
        message_type = data.messageType

        if not collaboration_id:
            LOG.info("Missing collaboration ID in message")
            return

        async with AsyncSessionLocal() as db:
            try:
                updated_data = await self.process_message(db, message_type, data)
                if updated_data:
                    data.data = json.dumps(updated_data)

                subject = f"editor.v1.collaboration.{collaboration_id}.users"
                await self.nats_client.publish(subject, data.model_dump_json().encode())
                LOG.info(f"Forwarded message to {subject}")

            except Exception as e:
                LOG.exception(f"Error processing message {message_type}: {str(e)}")

    async def process_message(self, db: AsyncSession, message_type: str, data: CollaborationMessage):
        if message_type == "fileCreated":
            return await self.handle_file_created(db, data)
        elif message_type == "fileUpdated":
            return await self.handle_file_updated(db, data)
        elif message_type == "fileDeleted":
            return await self.handle_file_deleted(db, data)
        elif message_type == "directoryCreated":
            return await self.handle_directory_created(db, data)
        elif message_type == "directoryDeleted":
            return await self.handle_directory_deleted(db, data)
        else:
            LOG.warning(f"Unknown message type: {message_type}")
            return None

    async def handle_file_created(self, db: AsyncSession, data: CollaborationMessage):
        payload = FileCreatedData(**json.loads(data.data))
        file_schema = await self.project_service.create_file(
            db=db,
            directory_id=int(payload.parentDirectoryId),
            file_name=payload.name,
            content=""
        )
        return file_schema.model_dump()

    async def handle_file_updated(self, db: AsyncSession, data: CollaborationMessage):
        payload = FileUpdatedData(**json.loads(data.data))

        updated_file = await self.project_service.update_file(
            db=db,
            file_id=int(payload.fileId),
            new_content=payload.newContent
        )
        return updated_file.model_dump() if updated_file else None

    async def handle_file_deleted(self, db: AsyncSession, data: CollaborationMessage):
        return {} # TODO

    async def handle_directory_created(self, db: AsyncSession, data: CollaborationMessage):
        payload = DirectoryCreatedData(**json.loads(data.data))
        dir_schema = await self.project_service.add_directory(
            db=db,
            parent_directory_id=int(payload.parentDirectoryId),
            dir_name=payload.name
        )

        return DirectorySchema(
            id=dir_schema.id,
            parent_directory_id=dir_schema.parent_directory_id,
            name=dir_schema.name,
            subdirectories=[],
            files=[]
        )

    async def handle_directory_deleted(self, db: AsyncSession, data: CollaborationMessage):
        return {} # TODO

    async def close(self):
        await self.nats_client.close()
        LOG.info("Disconnected from NATS")

    @cached_property
    def instance(self):
        return self
