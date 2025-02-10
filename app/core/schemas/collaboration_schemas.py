from pydantic import BaseModel
from typing import List

class CollaborationResponseSchema(BaseModel):
    id: int
    project_id: int
    users: List[str]
