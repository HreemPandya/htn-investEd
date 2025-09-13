from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Transaction(BaseModel):
    id: Optional[int] = None
    user_id: str
    merchant: str
    amount: float
    date: datetime
    description: Optional[str] = None
    category: Optional[str] = None
    # This class is for Pydantic v2
    class Config:
        from_attributes = True  # allow .from_orm()
