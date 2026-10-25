from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from typing import List
import os
from pathlib import Path

# Base directory for backend
BACKEND_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    app_passcode: str = Field(default="allchess123")
    frontend_origin: str = Field(default="http://localhost:5173")
    database_url: str = Field(default="sqlite:///./all_chess.db")
    stockfish_path: str = Field(default="backend/bin/stockfish.exe")
    chesscom_contact_email: str = Field(default="contact@allchess.local")
    
    gemini_api_key_1: str = Field(default="")
    gemini_api_key_2: str = Field(default="")
    gemini_api_key_3: str = Field(default="")
    
    groq_api_key_1: str = Field(default="")
    groq_api_key_2: str = Field(default="")
    
    session_secret: str = Field(default="all-chess-private-cookie-secret-2026")
    session_cookie_name: str = Field(default="all_chess_session")

    model_config = SettingsConfigDict(
        env_file=str(BACKEND_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def allowed_origins(self) -> List[str]:
        origins = {"http://localhost:5173", "http://127.0.0.1:5173"}
        if self.frontend_origin:
            origins.add(self.frontend_origin.rstrip("/"))
        return list(origins)

    @property
    def gemini_keys(self) -> List[str]:
        keys = [self.gemini_api_key_1, self.gemini_api_key_2, self.gemini_api_key_3]
        return [k.strip() for k in keys if k and k.strip() and "your_gemini" not in k]

    @property
    def groq_keys(self) -> List[str]:
        keys = [self.groq_api_key_1, self.groq_api_key_2]
        return [k.strip() for k in keys if k and k.strip() and "your_groq" not in k]

settings = Settings()
