from __future__ import annotations

import secrets

ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789"


def make_slug(length: int = 4) -> str:
    return "".join(secrets.choice(ALPHABET) for _ in range(length))
