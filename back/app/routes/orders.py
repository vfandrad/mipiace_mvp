from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List
from app.database import get_db

router = APIRouter(prefix="/orders", tags=["Orders"])

# --- SCHEMAS AGNOSTICOS ---
class OrderItemSchema(BaseModel):
    product_id: str
    selected_complement_ids: List[str] = [] # Lista de IDs de qualquer complemento
    quantity: int = 1

class OrderCreateSchema(BaseModel):
    customer_name: str
    customer_phone: str
    total_price: float # Calculado pelo n8n com base nos IDs
    items: List[OrderItemSchema]

# --- WEBHOOK DO N8N ---
@router.post("/webhook/n8n")
async def receive_order(payload: OrderCreateSchema, db=Depends(get_db)):
    """
    Salva o pedido de forma escalável. 
    Armazena a relação IDs de produtos e complementos.
    """
    try:
        # 1. Cria o registro do Pedido (Order)
        order_res = db.table("orders").insert({
            "customer_name": payload.customer_name,
            "customer_phone": payload.customer_phone,
            "total_price": payload.total_price,
            "status": "novo"
        }).execute()
        order_id = order_res.data[0]['id']

        # 2. Cria os itens do pedido (Order Items)
        for item in payload.items:
            # Aqui você salva o item principal e os complementos escolhidos
            # Dica: Você pode salvar os IDs dos complementos como um JSONB no Supabase
            db.table("order_items").insert({
                "order_id": order_id,
                "product_id": item.product_id,
                "complement_ids": item.selected_complement_ids, # Campo JSONB no banco
                "quantity": item.quantity
            }).execute()

        return {"status": "success", "order_id": order_id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# --- KANBAN (PARA O LOVABLE) ---
@router.get("/")
async def get_orders_for_kanban(db=Depends(get_db)):
    """
    Busca pedidos com JOINs para mostrar nomes legíveis no Dashboard.
    """
    res = db.table("orders").select("*, order_items(*, products(name))").order("created_at", desc=True).execute()
    return res.data