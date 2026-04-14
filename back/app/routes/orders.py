import os
import httpx
from fastapi import APIRouter, Depends, HTTPException, Request
from app.database import get_db
from app.schemas.order import OrderCreate, OrderUpdatePayment

router = APIRouter(prefix="/orders", tags=["Orders"])

# --- 1. WEBHOOK DO N8N (CRIA O PEDIDO) ---
@router.post("/webhook/n8n")
async def receive_order(payload: OrderCreate, db=Depends(get_db)):
    """
    Salva o pedido e prepara o terreno para o pagamento.
    """
    try:
        end = payload.endereco
        
        order_res = db.table("orders").insert({
            "customer_name": payload.customer_name,
            "customer_phone": payload.customer_phone,
            "total_price": payload.total_price,
            "rua": end.rua if end else None,
            "numero": end.numero if end else None,
            "bairro": end.bairro if end else None,
            "complemento_endereco": end.complemento if end else None,
            "status": "novo",
            "payment_status": "pendente", # Já nasce pendente
            "payment_id": payload.payment_id,
            "payment_link": payload.payment_link,
            "payment_method": payload.payment_method
        }).execute()
        
        order_id = order_res.data[0]['id']

        items_to_insert = []
        for item in payload.items:
            items_to_insert.append({
                "order_id": order_id,
                "product_id": item.product_id,
                "complement_ids": item.selected_complement_ids,
                "quantity": item.quantity,
                "details": item.details
            })

        if items_to_insert:
            db.table("order_items").insert(items_to_insert).execute()

        return {"status": "success", "order_id": order_id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# --- 2. ATUALIZAR DADOS DO PIX (N8N CHAMA APÓS O MP) ---
@router.patch("/{order_id}/payment-info")
async def update_payment_info(order_id: str, payload: OrderUpdatePayment, db=Depends(get_db)):
    """
    O n8n chama essa rota para injetar o 'Copia e Cola' e o ID da transação no banco
    para que o lojista veja no Lovable.
    """
    try:
        db.table("orders").update({
            "payment_id": payload.payment_id,
            "payment_link": payload.payment_link,
            "payment_method": payload.payment_method
        }).eq("id", order_id).execute()
        
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# --- 3. WEBHOOK DO MERCADO PAGO (CONFIRMA O PIX) ---
@router.post("/webhook/mercadopago")
async def mp_webhook(request: Request, db=Depends(get_db)):
    """
    Escuta a instituição financeira. Se pago, libera o pedido no Lovable.
    """
    data = await request.json()
    
    # O Mercado Pago dispara eventos com type ou topic = 'payment'
    if data.get("type") == "payment" or data.get("topic") == "payment":
        payment_id = data.get("data", {}).get("id")
        
        if not payment_id:
            return {"status": "ignored"}

        mp_token = os.getenv("MP_ACCESS_TOKEN")
        if not mp_token:
            print("🚨 AVISO: MP_ACCESS_TOKEN não configurado no .env")
            return {"status": "error", "message": "Falta chave de segurança"}

        # Verificação de Segurança (Impede 'Fake Pix')
        async with httpx.AsyncClient() as client:
            headers = {"Authorization": f"Bearer {mp_token}"}
            response = await client.get(f"https://api.mercadopago.com/v1/payments/{payment_id}", headers=headers)
            
            if response.status_code == 200:
                payment_info = response.json()
                status = payment_info.get("status")
                external_reference = payment_info.get("external_reference") # É o seu order_id

                # Se o Pix foi pago e existe a referência cruzada
                if status == "approved" and external_reference:
                    db.table("orders").update({
                        "payment_status": "pago",
                        "status": "preparando" # Automatiza o movimento no Kanban
                    }).eq("id", external_reference).execute()

    return {"status": "ok"}

@router.get("/")
async def get_orders_for_kanban(db=Depends(get_db)):
    """
    Devolve a lista atualizada para a interface visual.
    """
    res = db.table("orders").select("*, order_items(*, products(name))").order("created_at", desc=True).execute()
    return res.data

from pydantic import BaseModel

class StatusUpdate(BaseModel):
    status: str

@router.patch("/{order_id}")
async def update_order_status(order_id: str, payload: StatusUpdate, db=Depends(get_db)):
    """
    ESSA ROTA ESTAVA FALTANDO. 
    É ela que o Kanban chama para mover o card de coluna.
    """
    try:
        res = db.table("orders").update({
            "status": payload.status,
            "updated_at": "now()" # Vital para o cronômetro do Kanban
        }).eq("id", order_id).execute()
        
        if not res.data:
            raise HTTPException(status_code=404, detail="Pedido não encontrado")
            
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))