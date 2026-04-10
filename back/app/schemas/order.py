from pydantic import BaseModel
from typing import List, Optional

# Novo schema para padronizar o endereço vindo do n8n
class AddressSchema(BaseModel):
    rua: Optional[str] = None
    numero: Optional[str] = None
    bairro: Optional[str] = None
    complemento: Optional[str] = None

class OrderItemSchema(BaseModel):
    product_id: str
    selected_complement_ids: List[str] = [] # Agora suporta a lista de complementos
    quantity: int = 1
    details: Optional[str] = None

# Único schema de criação de pedido para toda a aplicação
class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    total_price: float
    endereco: Optional[AddressSchema] = None # Adicionado para corrigir a incoerência
    items: List[OrderItemSchema]

class OrderUpdateStatus(BaseModel):
    status: Optional[str] = None
    payment_status: Optional[str] = None