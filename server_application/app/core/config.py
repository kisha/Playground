"""Application settings, resolved per environment.

APP_ENV picks the environment (development | staging | production). Settings are then
loaded from, in increasing priority:

    .env.<APP_ENV>          committed, non-secret defaults
    .env.<APP_ENV>.local    git-ignored, local secrets and overrides
    real environment vars   what a hosting platform injects

so the same code runs everywhere and only configuration changes.
"""

import os
from enum import StrEnum
from functools import lru_cache
from pathlib import Path

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

SERVER_ROOT = Path(__file__).resolve().parents[2]


class Environment(StrEnum):
    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"


def _current_environment() -> Environment:
    return Environment(os.getenv("APP_ENV", Environment.DEVELOPMENT))


def _env_files(environment: Environment) -> tuple[Path, ...]:
    return (
        SERVER_ROOT / f".env.{environment}",
        SERVER_ROOT / f".env.{environment}.local",
    )


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=_env_files(_current_environment()),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    APP_ENV: Environment = Environment.DEVELOPMENT
    PROJECT_NAME: str = "Playground API"
    VERSION: str = "0.1.0"
    API_V1_PREFIX: str = "/api/v1"

    DATABASE_URL: str = ""
    DATABASE_ECHO: bool = False
    DATABASE_POOL_SIZE: int = 5
    DATABASE_MAX_OVERFLOW: int = 10

    CORS_ORIGINS: list[str] = []

    @property
    def is_development(self) -> bool:
        return self.APP_ENV is Environment.DEVELOPMENT

    @property
    def is_production(self) -> bool:
        return self.APP_ENV is Environment.PRODUCTION

    @property
    def async_database_url(self) -> str:
        """DATABASE_URL with the asyncpg driver, whatever form the host provides it in."""
        for prefix in ("postgres://", "postgresql://"):
            if self.DATABASE_URL.startswith(prefix):
                return "postgresql+asyncpg://" + self.DATABASE_URL.removeprefix(prefix)
        return self.DATABASE_URL

    @model_validator(mode="after")
    def _require_database_url(self) -> Settings:
        # Fail at startup with a clear message instead of on the first query.
        if not self.DATABASE_URL:
            raise ValueError(
                f"DATABASE_URL is not set for APP_ENV={self.APP_ENV}. "
                f"Set it in .env.{self.APP_ENV}.local or as an environment variable."
            )
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
