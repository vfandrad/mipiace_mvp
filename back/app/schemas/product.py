from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID

# Este é o schema que estava dando erro 400
class CategoryCreate(BaseModel):
    name: str
    product_id: UUID # Obrigatório para vincular a categoria ao produto
    is_required: bool = False # Alinhado com o Switch do front
    min_choices: int = 0
    max_choices: int = 1

class ProductCreate(BaseModel):
    name: str
    base_price: float # Mudamos de price para base_price conforme os outros ajustes
    is_available: bool = True