from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class CollaborationMessage(BaseModel):
    messageType: str
    collaborationId: int
    timestamp: datetime
    data: str

class FileCreatedData(BaseModel):
    name: str
    parentDirectoryId: int
    createdBy: str

class FileUpdatedData(BaseModel):
    fileId: str
    fileName: str
    updatedBy: str
    newContent: str

class FileDeletedData(BaseModel):
    pass

class DirectoryCreatedData(BaseModel):
    name: str
    parentDirectoryId: int
    createdBy: str

class DirectoryUpdatedData(BaseModel):
    pass

class DirectoryDeletedData(BaseModel):
    pass

class UserJoinedData(BaseModel):
    userId: str
    userName: str

class UserLeftData(BaseModel):
    userId: str
    userName: str
