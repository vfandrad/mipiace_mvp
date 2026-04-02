from pydantic import BaseModel
from typing import List, Optional

class OrderItemSchema(BaseModel):
    product_id: str
    quantity: int

class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    items: List[OrderItemSchema]

class OrderUpdateStatus(BaseModel):
    status: Optional[str] = None
    payment_status: Optional[str] = None