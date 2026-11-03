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
    # Engine resources. Defaults suit a desktop; on a 512 MB host set ENGINE_POOL_SIZE=1, ENGINE_HASH_MB=16, ENGINE_THREADS=1.
    engine_pool_size: int = Field(default=2, ge=1, le=8)
    engine_hash_mb: int = Field(default=128, ge=1, le=4096)
    engine_threads: int = Field(default=2, ge=1, le=64)
    stockfish_path: str = Field(default="backend/bin/stockfish.exe")
    chesscom_contact_email: str = Field(default="contact@allchess.local")
    
    gemini_api_key_1: str = Field(default="")
    gemini_api_key_2: str = Field(default="")
    gemini_api_key_3: str = Field(default="")
    
    groq_api_key_1: str = Field(default="")
    groq_api_key_2: str = Field(default="")
    
    session_cookie_name: str = Field(default="all_chess_session")
    # In production (https) set COOKIE_SECURE=true. COOKIE_SAMESITE is "lax" (same-site / proxied /api)
    # or "none" (frontend and API on different sites; needs COOKIE_SECURE=true).
    cookie_secure: bool = Field(default=False)
    cookie_samesite: str = Field(default="lax")
    # Chess.com accuracy curve settings (softer curve calibrated to reference games)
    accuracy_chesscom_scale: float = Field(default=8.0)
    accuracy_chesscom_power: float = Field(default=1.1)
    accuracy_chesscom_weight_power: float = Field(default=0.30)
    accuracy_level_scale_step: float = Field(default=1.0)
    # Game rating at Deep/Deeper/Max = the Standard rating minus this many points per level, the same for both players.
    # (Accuracy gets stricter per level; pushing that through the steep accuracy->rating table would cost the weaker
    # player far more rating than the stronger one and blow the gap between them up.)
    rating_level_penalty_step: int = Field(default=60)
    # Accuracy formula used at the Max level: "lichess" (Lichess's open formula, the harshest) or "chesscom" (the
    # Chess.com-fitted formula every other level uses). Set MAX_LEVEL_ACCURACY_METHOD=chesscom to go back.
    max_level_accuracy_method: str = Field(default="lichess")

    # Performance rating mapping settings
    # estimated = clamp(100, 3000, player_rating + (accuracy - expected_accuracy) * sensitivity_k)
    # expected_accuracy = base + (rating / 3000) * slope
    rating_expected_acc_base: float = Field(default=60.0)
    rating_expected_acc_slope: float = Field(default=35.0)
    rating_sensitivity_k: float = Field(default=33.0)

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
if not is_testing_environment():
    if not settings.app_passcode.strip() or settings.app_passcode.strip() in PLACEHOLDER_SECRETS:
        raise RuntimeError("APP_PASSCODE is required in backend/.env and must not be a placeholder.")
    if not settings.session_secret.strip() or settings.session_secret.strip() in PLACEHOLDER_SECRETS:
        raise RuntimeError("SESSION_SECRET is required in backend/.env and must not be a placeholder.")
