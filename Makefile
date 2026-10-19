.DEFAULT_GOAL := help
SHELL := /bin/bash

-include .env
export

COMPOSE := docker compose

.PHONY: help setup db db-down db-logs db-shell db-reset

help: ## Show available commands
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[1m%-12s\033[0m %s\n", $$1, $$2}'

setup: ## Create local .env from the template (safe to re-run)
	@test -f .env || (cp .env.example .env && echo "Created .env from .env.example")

db: setup ## Start Postgres 18 + pgvector and wait until it is healthy
	$(COMPOSE) up -d --wait db

db-down: ## Stop Postgres (data is kept)
	$(COMPOSE) down

db-logs: ## Follow Postgres logs
	$(COMPOSE) logs -f db

db-shell: ## Open psql inside the database container
	$(COMPOSE) exec db psql -U $(POSTGRES_USER) -d $(POSTGRES_DB)

db-reset: ## Destroy the database volume and start fresh
	$(COMPOSE) down -v
	$(COMPOSE) up -d --wait db
