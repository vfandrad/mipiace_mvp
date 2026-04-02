from fastapi import APIRouter, Depends, HTTPException
from app.database import get_db
from app.schemas.product import ProductCreate

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("/")
async def list_products(db=Depends(get_db)):
    res = db.table("products").select("*").order("name").execute()
    return res.data

@router.post("/")
async def create_product(product: ProductCreate, db=Depends(get_db)):
    res = db.table("products").insert(product.dict()).execute()
    return res.data[0]

@router.delete("/{id}")
async def delete_product(id: str, db=Depends(get_db)):
    db.table("products").delete().eq("id", id).execute()
    return {"message": "Deletado com sucesso"}