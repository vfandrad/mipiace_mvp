import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Carrega as variáveis do arquivo .env
load_dotenv()

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")

# Trava de segurança caso o .env não seja lido corretamente
if not url or not key:
    raise ValueError("⚠️ As credenciais do Supabase não foram encontradas no ambiente.")

supabase: Client = create_client(url, key)

def get_db():
    return supabase