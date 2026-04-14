from fastapi import APIRouter, Depends, HTTPException
from app.database import get_db

router = APIRouter(prefix="/products", tags=["Inventory"])

# --- OUTPUT PARA O N8N (CARDÁPIO GENÉRICO) ---
# No products.py, atualize o menu-summary:
@router.get("/menu-summary")
async def get_menu_summary(db=Depends(get_db)):
    try:
        # Buscamos os dados
        p = db.table("products").select("id, name, base_price").eq("is_available", True).execute()
        g = db.table("complement_groups").select("id, product_id, name, min_choices, max_choices, is_required").execute()
        c = db.table("complements").select("id, group_id, name, extra_price").eq("is_available", True).execute()
        
        return {
            "products": p.data,
            "groups": g.data,
            "complements": c.data
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
    # Adicionamos 'complement_group' no mapeamento de tabelas
    if type == "product":
        table = "products"
    elif type == "complement":
        table = "complements"
    elif type == "complement_group": # ADICIONADO: Para apagar a categoria
        table = "complement_groups"
    else:
        raise HTTPException(status_code=400, detail="Tipo inválido")

    try:
        # Se o banco estiver com ON DELETE CASCADE (como expliquei antes),
        # apagar o grupo aqui vai limpar automaticamente os sabores dentro dele.
        res = db.table(table).delete().eq("id", id).execute()
        return {"status": "success", "message": f"{type} removido com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao deletar: {str(e)}")

# --- CRIAR ITENS (Necessário para os botões "+" do Lovable) ---

@router.post("/{type}")
async def create_item(type: str, data: dict, db=Depends(get_db)):
    """
    Cria um novo produto, complemento ou grupo de complementos.
    """
    # 1. MAPEAMENTO DE TABELAS (O que faltava)
    if type == "product":
        table = "products"
    elif type == "complement":
        table = "complements"
    elif type == "complement_group":
        table = "complement_groups"
    else:
        raise HTTPException(status_code=400, detail="Tipo de item inválido")

    try:
        # 2. LIMPEZA DE DADOS (Garantir que o que vai pro banco é o que o banco espera)
        # Se for categoria, garantimos que campos numéricos não sejam strings
        if type == "complement_group":
            data["min_choices"] = int(data.get("min_choices", 0))
            data["max_choices"] = int(data.get("max_choices", 1))
            data["is_required"] = bool(data.get("is_required", False))

        # 3. INSERÇÃO NO SUPABASE/BANCO
        res = db.table(table).insert(data).execute()
        
        if not res.data:
            raise Exception("Nenhum dado retornado após inserção")
            
        return res.data[0]
        
    except Exception as e:
        # Aqui o log vai te dizer exatamente qual coluna está faltando se o erro persistir
        print(f"ERRO NO BANCO: {str(e)}") 
        raise HTTPException(status_code=400, detail=f"Erro ao criar no banco: {str(e)}")