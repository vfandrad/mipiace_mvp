from pydantic import BaseModel
from typing import Optional

class CategoryCreate(BaseModel):
    name: str
    requires_price: bool = True

class ProductCreate(BaseModel):
    name: str
    category_id: str
    price: Optional[float] = None
    is_available: bool = True