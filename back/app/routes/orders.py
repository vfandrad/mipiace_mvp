from fastapi import APIRouter, Depends, HTTPException
from app.database import get_db
from app.schemas.order import OrderUpdateStatus
from app.services.order_service import process_n8n_order

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.get("/")
async def get_orders(db=Depends(get_db)):
    # Retorna o pedido, os itens e o nome/preço do produto vinculado (para o Kanban)
    res = db.table("orders").select("*, order_items(*, products(name, price))").order("created_at").execute()
    return res.data

@router.patch("/{id}")
async def update_order(id: str, payload: OrderUpdateStatus, db=Depends(get_db)):
    update_data = payload.dict(exclude_unset=True)
    res = db.table("orders").update(update_data).eq("id", id).execute()
    return res.data[0]

@router.post("/webhook/n8n")
async def receive_n8n_order(payload: dict, db=Depends(get_db)):
    """
    Recebe o JSON do n8n com a intenção validada de compra do cliente.
    """
    try:
        new_order = process_n8n_order(payload, db)
        return {"status": "success", "order": new_order}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))