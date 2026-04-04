from fastapi import APIRouter, Depends
from app.database import get_db
from app.schemas.product import ProductCreate, ProductUpdateAtivarInativar

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("/")
async def list_products(db=Depends(get_db)):
    res = db.table("products").select("*").order("name").execute()
    return res.data

@router.post("/")
async def create_product(product: ProductCreate, db=Depends(get_db)):
    res = db.table("products").insert(product.dict()).execute()
    return res.data[0]

@router.get("/{id}")
async def get_product_detail(id: str, db=Depends(get_db)):
    res = db.table("products").select("*").eq("id", id).execute()
    return res.data[0]

@router.patch("/{id}")
async def update_product(id: str, product: ProductCreate, db=Depends(get_db)):
    update_data = product.dict(exclude_unset=True)
    db.table("products").update(update_data).eq("id", id).execute()
    return {"message": "Alterado com sucesso"}

@router.patch("/{id}/ativar-inativar")
async def ativar_inativar_product(id: str, payload: ProductUpdateAtivarInativar, db=Depends(get_db)):
    db.table("products").update({"is_available": payload.is_available}).eq("id", id).execute()
    return {"message": "Alterado com sucesso"}

@router.delete("/{id}")
async def delete_product(id: str, db=Depends(get_db)):
    db.table("products").delete().eq("id", id).execute()

    return {"message": "Deletado com sucesso"}