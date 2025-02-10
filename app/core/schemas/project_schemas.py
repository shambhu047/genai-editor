from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional

class FileSchema(BaseModel):
    id: int
    name: str
    content: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class DirectorySchema(BaseModel):
    id: int
    name: str
    parent_directory_id: Optional[int] = None
    subdirectories: List["DirectorySchema"] = Field(default_factory=list)
    files: List[FileSchema] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)

class ProjectSchema(BaseModel):
    id: int
    name: str
    root_directory_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)
