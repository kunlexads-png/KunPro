from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Cerebro BI - Enterprise AI Analytics"
    VERSION: str = "3.4.0"
    ENVIRONMENT: str = "production"
    DEBUG: bool = False
    
    # Server & CORS
    FRONTEND_URL: str = "http://localhost:3000"
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/cerebro_bi"
    
    # Security
    JWT_SECRET_KEY: str = "secret-key-change-in-production-vault"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # AI Engine
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-3.8-flash"

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
