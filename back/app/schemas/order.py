from pydantic import BaseModel
from typing import List, Optional

class AddressSchema(BaseModel):
    rua: Optional[str] = None
    numero: Optional[str] = None
    bairro: Optional[str] = None
    complemento: Optional[str] = None

class OrderItemSchema(BaseModel):
    product_id: str
    selected_complement_ids: List[str] = []
    quantity: int = 1
    details: Optional[str] = None

class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    total_price: float
    chat_id: Optional[str] = None
    endereco: Optional[AddressSchema] = None
    items: List[OrderItemSchema]
    payment_id: Optional[str] = None
    payment_link: Optional[str] = None
    payment_method: Optional[str] = "pix"

class OrderUpdateStatus(BaseModel):
    status: Optional[str] = None
    payment_status: Optional[str] = None

# Schema para o n8n salvar os dados do Pix após gerá-lo
class OrderUpdatePayment(BaseModel):
    payment_id: str
    payment_link: str
    payment_method: str = "pix"