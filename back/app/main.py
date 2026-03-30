from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import products, orders

app = FastAPI(title="Mi Piace Gelato API")

# Permite que o frontend (Lovable/Vite) na porta 5173 acesse a API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(orders.router)

@app.get("/")
def health_check():
    return {"status": "ok", "app": "Mi Piace Backend"}