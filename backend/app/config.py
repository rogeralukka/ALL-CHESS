from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from typing import List
import os
from pathlib import Path

# Base directory for backend
BACKEND_DIR = Path(__file__).resolve().parent.parent

PLACEHOLDER_SECRETS = {
    "",
    "your_secret_passcode_here",
    "your_session_secret_here",
    "replace_me",
    "change_me",
    "all-chess-private-cookie-secret-2026",
}

def is_testing_environment() -> bool:
    return bool(
        os.environ.get("TESTING", "").lower() in ("true", "1")
        or "PYTEST_CURRENT_TEST" in os.environ
    )

class Settings(BaseSettings):
    app_passcode: str = Field(default="")
    session_secret: str = Field(default="")
    seed_demo_data: bool = Field(default=False)
    frontend_origin: str = Field(default="http://localhost:5173")
    database_url: str = Field(default="sqlite:///./all_chess.db")
    stockfish_path: str = Field(default="backend/bin/stockfish.exe")
    chesscom_contact_email: str = Field(default="contact@allchess.local")
    
    gemini_api_key_1: str = Field(default="")
    gemini_api_key_2: str = Field(default="")
    gemini_api_key_3: str = Field(default="")
    
    groq_api_key_1: str = Field(default="")
    groq_api_key_2: str = Field(default="")
    
    session_cookie_name: str = Field(default="all_chess_session")
    # Chess.com accuracy curve settings (softer curve calibrated to reference games)
    accuracy_chesscom_scale: float = Field(default=8.0)
    accuracy_chesscom_power: float = Field(default=1.1)
    accuracy_chesscom_weight_power: float = Field(default=0.4)

    # Performance rating mapping settings
    # estimated = clamp(100, 3000, player_rating + (accuracy - expected_accuracy) * sensitivity_k)
    # expected_accuracy = base + (rating / 3000) * slope
    rating_expected_acc_base: float = Field(default=60.0)
    rating_expected_acc_slope: float = Field(default=35.0)
    rating_sensitivity_k: float = Field(default=45.0)

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

# Validate secrets on startup (skip only when running tests)
if is_testing_environment():
    if not settings.app_passcode or settings.app_passcode in PLACEHOLDER_SECRETS:
        settings.app_passcode = "allchess123"
    if not settings.session_secret or settings.session_secret in PLACEHOLDER_SECRETS:
        settings.session_secret = "test-session-secret-key-32-chars-long-123456"
else:
    if not settings.app_passcode.strip() or settings.app_passcode.strip() in PLACEHOLDER_SECRETS:
        raise RuntimeError("APP_PASSCODE is required in backend/.env and must not be a placeholder.")
    if not settings.session_secret.strip() or settings.session_secret.strip() in PLACEHOLDER_SECRETS:
        raise RuntimeError("SESSION_SECRET is required in backend/.env and must not be a placeholder.")
