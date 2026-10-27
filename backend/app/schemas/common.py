from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel
from typing import Any

class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )

class ErrorResponse(CamelModel):
    error: str
    detail: Any
