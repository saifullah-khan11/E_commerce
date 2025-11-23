import os
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

class Settings:
    supabase_url: str = os.getenv("SUPABASE_URL", "")
    supabase_key: str = os.getenv("SUPABASE_KEY", "")
    supabase_anon_key: str = os.getenv("SUPABASE_ANON_KEY", "")
    jwt_secret: str = os.getenv("JWT_SECRET", "")
    cors_origins: list = os.getenv("CORS_ORIGINS", "*").split(",")
    mongo_url: str = os.environ['MONGO_URL']
    db_name: str = os.environ['DB_NAME']

settings = Settings()
