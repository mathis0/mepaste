FROM python:3.12-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

COPY pyproject.toml ./
RUN pip install --no-cache-dir \
      "fastapi>=0.110" \
      "uvicorn[standard]>=0.27" \
      "sqlalchemy[asyncio]>=2.0" \
      "asyncpg>=0.29" \
      "alembic>=1.13" \
      "pydantic>=2.6" \
      "passlib[bcrypt]>=1.7.4" \
      "bcrypt==4.0.1"

COPY . .

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
