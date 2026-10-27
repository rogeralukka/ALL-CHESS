# ALL-CHESS API: FastAPI + native Stockfish.
FROM python:3.12-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends stockfish \
    && rm -rf /var/lib/apt/lists/*

ENV PATH="/usr/games:${PATH}" \
    STOCKFISH_PATH=/usr/games/stockfish \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
# Render (and most hosts) pass the port in $PORT. --proxy-headers so https is seen behind the host's proxy.
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --proxy-headers --forwarded-allow-ips='*'"]
