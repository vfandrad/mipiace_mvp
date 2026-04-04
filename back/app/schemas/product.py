from pydantic import BaseModel
from typing import Optional

class ProductBase(BaseModel):
    name: str
    price: float
    is_available: bool = True

class ProductCreate(ProductBase):
    pass

class ProductUpdateAtivarInativar(BaseModel):
    is_available: bool

class ProductResponse(ProductBase):
    id: str
    created_at: str