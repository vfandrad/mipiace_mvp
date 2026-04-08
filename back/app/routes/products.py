from fastapi import APIRouter, Depends
from app.database import get_db
from app.schemas.product import ProductCreate, CategoryCreate

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("/categories")
async def list_categories(db=Depends(get_db)):
    return db.table("categories").select("*").order("display_order").execute().data

@router.post("/categories")
async def create_category(cat: CategoryCreate, db=Depends(get_db)):
    return db.table("categories").insert(cat.dict()).execute().data

@router.get("/")
async def list_products(db=Depends(get_db)):
    # Retorna produtos com dados da categoria aninhados
    return db.table("products").select("*, categories(*)").order("name").execute().data

@router.patch("/{id}/status")
async def toggle_availability(id: str, is_available: bool, db=Depends(get_db)):
    return db.table("products").update({"is_available": is_available}).eq("id", id).execute().data