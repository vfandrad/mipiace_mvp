from fastapi import APIRouter, Depends, HTTPException
from app.database import get_db
# Importando o Schema centralizado!
from app.schemas.order import OrderCreate 

router = APIRouter(prefix="/orders", tags=["Orders"])

# --- WEBHOOK DO N8N ---
@router.post("/webhook/n8n")
async def receive_order(payload: OrderCreate, db=Depends(get_db)):
    """
    Salva o pedido de forma escalável. 
    Lê o endereço corretamente e armazena a relação IDs de produtos e complementos.
    """
    try:
        # 1. Extraindo o endereço com segurança (pode vir vazio)
        end = payload.endereco
        
        # 2. Cria o registro do Pedido (Order)
        order_res = db.table("orders").insert({
            "customer_name": payload.customer_name,
            "customer_phone": payload.customer_phone,
            "total_price": payload.total_price,
            "rua": end.rua if end else None,
            "numero": end.numero if end else None,
            "bairro": end.bairro if end else None,
            "complemento_endereco": end.complemento if end else None,
            "status": "novo"
        }).execute()
        
        order_id = order_res.data[0]['id']

        # 3. Cria os itens do pedido (Order Items) de forma otimizada (Bulk Insert)
        items_to_insert = []
        for item in payload.items:
            items_to_insert.append({
                "order_id": order_id,
                "product_id": item.product_id,
                "complement_ids": item.selected_complement_ids, # JSONB indo limpo para o banco
                "quantity": item.quantity,
                "details": item.details
            })

        if items_to_insert:
            db.table("order_items").insert(items_to_insert).execute()

        return {"status": "success", "order_id": order_id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# --- KANBAN (PARA O LOVABLE) ---
@router.get("/")
async def get_orders_for_kanban(db=Depends(get_db)):
    """
    Busca pedidos com JOINs. O Front-End fará o 'de-para' dos IDs dos complementos.
    """
    res = db.table("orders").select("*, order_items(*, products(name))").order("created_at", desc=True).execute()
    return res.data