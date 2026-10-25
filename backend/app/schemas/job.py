from typing import Optional, Literal, Any
from app.schemas.common import CamelModel

class JobResponse(CamelModel):
    job_id: str

class JobStatusResponse(CamelModel):
    id: str
    job_type: str
    status: Literal['queued', 'processing', 'done', 'failed']
    progress: int
    error: Optional[str] = None
    result: Optional[Any] = None
