try:
    import truststore
    truststore.inject_into_ssl()
except ImportError:
    pass

import logging
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
import os
from pathlib import Path
from alembic.config import Config
from alembic import command
from app.config import settings
from app.database import engine as db_engine, Base
import app.models  # registers models with Base
from app.routers import auth, games, sync, stats, jobs, engine as engine_router, puzzles, learn, friends, coach
from app.services.seeder import seed_puzzles
from app.database import SessionLocal

logger = logging.getLogger("all_chess")

def run_db_migrations():
    if os.environ.get("TESTING") == "1":
        return
    try:
        backend_dir = Path(__file__).resolve().parent.parent
        alembic_ini = backend_dir / "alembic.ini"
        if alembic_ini.exists():
            alembic_cfg = Config(str(alembic_ini))
            alembic_cfg.set_main_option("script_location", str(backend_dir / "alembic"))
            command.upgrade(alembic_cfg, "head")
            logger.info("Database migrations applied successfully.")
        else:
            Base.metadata.create_all(bind=db_engine)
    except Exception as e:
        logger.warning(f"Could not run alembic migrations, falling back to create_all: {e}")
        Base.metadata.create_all(bind=db_engine)

# Apply migrations on application startup
run_db_migrations()
try:
    with SessionLocal() as db:
        seed_puzzles(db)
except Exception:
    pass

app = FastAPI(
    title="ALL-CHESS API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Explicit CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Standard error handler format: { error: str, detail: Any }
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    error_type = "HTTPException"
    if exc.status_code == 401:
        error_type = "Unauthorized"
    elif exc.status_code == 404:
        error_type = "NotFound"
    elif exc.status_code == 403:
        error_type = "Forbidden"
    elif exc.status_code == 400:
        error_type = "BadRequest"
    elif exc.status_code == 429:
        error_type = "TooManyRequests"
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": error_type, "detail": exc.detail}
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"error": "ValidationError", "detail": exc.errors()}
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled server error on {request.method} {request.url.path}: {exc}")
    return JSONResponse(
        status_code=500,
        content={"error": "InternalServerError", "detail": "An internal server error occurred."}
    )

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "ALL-CHESS API"}

# Register API v1 routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(games.router, prefix="/api/v1")
app.include_router(sync.router, prefix="/api/v1")
app.include_router(stats.router, prefix="/api/v1")
app.include_router(jobs.router, prefix="/api/v1")
app.include_router(engine_router.router, prefix="/api/v1")
app.include_router(puzzles.router, prefix="/api/v1")
app.include_router(learn.router, prefix="/api/v1")
app.include_router(friends.router, prefix="/api/v1")
app.include_router(coach.router, prefix="/api/v1")
