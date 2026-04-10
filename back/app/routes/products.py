from fastapi import APIRouter, Depends, HTTPException
from app.database import get_db

router = APIRouter(prefix="/products", tags=["Inventory"])

# --- OUTPUT PARA O N8N (CARDÁPIO GENÉRICO) ---
@router.get("/menu-summary")
async def get_menu_summary(db=Depends(get_db)):
    """
    Retorna a estrutura completa para o n8n. 
    A IA usará esses IDs para identificar o que o cliente quer.
    """
    try:
        products = db.table("products").select("id, name, base_price").eq("is_available", True).execute()
        groups = db.table("complement_groups").select("id, name, min_choices, max_choices, is_required").execute()
        complements = db.table("complements").select("id, group_id, name, extra_price").eq("is_available", True).execute()
        
        return {
            "products": products.data,
            "groups": groups.data,
            "complements": complements.data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- GESTÃO ADMIN (PARA O LOVABLE) ---
@router.get("/")
async def list_inventory(db=Depends(get_db)):
    """Lista tudo para o Dashboard"""
    p = db.table("products").select("*").execute()
    g = db.table("complement_groups").select("*").execute()
    c = db.table("complements").select("*").execute()
    return {"products": p.data, "groups": g.data, "complements": c.data}

@router.patch("/{type}/{id}")
async def update_item(type: str, id: str, data: dict, db=Depends(get_db)):
    """
    Rota genérica para atualizar qualquer tabela (products ou complements).
    Ex: /products/products/{uuid} ou /products/complements/{uuid}
    """
    table = "products" if type == "product" else "complements"
    res = db.table(table).update(data).eq("id", id).execute()
    return res.data[0]

# --- DELETAR ITENS (Necessário para o CRUD do Lovable) ---

@router.delete("/{type}/{id}")
async def delete_item(type: str, id: str, db=Depends(get_db)):
    """
    Remove um produto ou complemento do banco.
    type: 'product' ou 'complement'
    """
    table = "products" if type == "product" else "complements"
    try:
        res = db.table(table).delete().eq("id", id).execute()
        return {"status": "success", "message": f"{type} removido com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao deletar: {str(e)}")

# --- CRIAR ITENS (Necessário para os botões "+" do Lovable) ---

@router.post("/{type}")
async def create_item(type: str, data: dict, db=Depends(get_db)):
    """
    Cria um novo produto ou complemento.
    """
    table = "products" if type == "product" else "complements"
    try:
        res = db.table(table).insert(data).execute()
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao criar: {str(e)}")