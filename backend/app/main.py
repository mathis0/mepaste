from __future__ import annotations

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import auth, pastes


def create_app() -> FastAPI:
    app = FastAPI(
        title="mepaste",
        version="0.4.2",
        description="one person, one textarea, one short link.",
    )

    cors_origin = os.environ.get("CORS_ORIGIN", "http://localhost:5173")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[o.strip() for o in cors_origin.split(",") if o.strip()],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/api/health")
    async def health() -> dict[str, str]:
        return {"status": "fresh", "vintage": "v0.4.2"}

    app.include_router(auth.router)
    app.include_router(pastes.router)
    return app


app = create_app()
