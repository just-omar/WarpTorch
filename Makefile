.PHONY: help up down logs restart clean build build-cpu build-cuda use-cpu use-cuda

# Load environment variables from .env file
ifneq (,$(wildcard ./.env))
    include .env
    export
endif

# Set default values if not defined in .env
FRONTEND_PORT ?= 3005
BACKEND_PORT ?= 8099
DOCS_PORT ?= 3553

DOCKER_COMPOSE := $(shell command -v docker-compose >/dev/null 2>&1 && echo "docker-compose" || echo "docker compose")

help:
	@echo "=========================================="
	@echo "🚀 WarpTorch - Warp Simulations"
	@echo "=========================================="
	@echo "Quick start:"
	@echo "  make up      - Build and start all services"
	@echo "  make down    - Stop all services"
	@echo "  make logs    - View logs"
	@echo "  make restart - Restart services"
	@echo "  make clean   - Full cleanup"
	@echo ""
	@echo "Hardware switching:"
	@echo "  make use-cpu  - Switch to CPU version (lightweight)"
	@echo "  make use-cuda - Switch to CUDA version (fast)"
	@echo ""
	@echo "Manual builds:"
	@echo "  make build       - Auto-detect hardware and build"
	@echo "  make build-cpu   - Build CPU-only Docker image"
	@echo "  make build-cuda  - Build CUDA-enabled Docker image"
	@echo "=========================================="

up:
	@echo "🐳 Building Docker images..."
	@if python3 detect_hardware.py | grep -q "NVIDIA"; then \
		echo "NVIDIA GPU detected - building CUDA version..."; \
		$(DOCKER_COMPOSE) build --build-arg TORCH_VERSION=cuda; \
	else \
		echo "Building CPU-only version..."; \
		$(DOCKER_COMPOSE) build --build-arg TORCH_VERSION=cpu; \
	fi
	@echo "🔧 Fixing Jupyter permissions..."
	@chmod 777 jupyter_notebooks/ 2>/dev/null || echo "jupyter_notebooks/ not found, will be created by Docker"
	@echo "🚀 Starting services..."
	$(DOCKER_COMPOSE) up -d
	@echo "✓ Services started!"
	@echo "  Frontend: http://localhost:$(FRONTEND_PORT)"
	@echo "  Backend:  http://localhost:$(BACKEND_PORT)"
	@echo "  API Docs: http://localhost:$(BACKEND_PORT)/docs"
	@echo "  Documentation: http://localhost:$(DOCS_PORT)"

down:
	$(DOCKER_COMPOSE) down

logs:
	$(DOCKER_COMPOSE) logs -f

restart:
	$(DOCKER_COMPOSE) restart

clean:
	$(DOCKER_COMPOSE) down -v --remove-orphans
	@echo "✓ Cleanup completed"

build:
	@echo "🔍 Detecting hardware..."
	@if python3 detect_hardware.py | grep -q "NVIDIA"; then \
		echo "Building with CUDA support..."; \
		$(DOCKER_COMPOSE) build --build-arg TORCH_VERSION=cuda; \
	else \
		echo "Building CPU-only version..."; \
		$(DOCKER_COMPOSE) build --build-arg TORCH_VERSION=cpu; \
	fi

build-cpu:
	@echo "🐳 Building CPU-only Docker image..."
	$(DOCKER_COMPOSE) build --build-arg TORCH_VERSION=cpu

build-cuda:
	@echo "🐳 Building CUDA-enabled Docker image..."
	$(DOCKER_COMPOSE) build --build-arg TORCH_VERSION=cuda

use-cpu:
	@echo "🔄 Switching to CPU version..."
	@echo "TORCH_VERSION=cpu" > .env
	@echo "FRONTEND_PORT=$(FRONTEND_PORT)" >> .env
	@echo "VITE_FRONTEND_PORT=$(FRONTEND_PORT)" >> .env
	@echo "BACKEND_PORT=$(BACKEND_PORT)" >> .env
	@echo "VITE_BACKEND_PORT=$(BACKEND_PORT)" >> .env
	@echo "DOCS_PORT=$(DOCS_PORT)" >> .env
	@echo "CORS_ORIGINS=http://localhost:$(FRONTEND_PORT),http://frontend:$(FRONTEND_PORT)" >> .env
	@$(DOCKER_COMPOSE) down
	@$(DOCKER_COMPOSE) build --no-cache --build-arg TORCH_VERSION=cpu
	@$(DOCKER_COMPOSE) up -d
	@echo "✓ Switched to CPU version"

use-cuda:
	@echo "🔄 Switching to CUDA version..."
	@echo "TORCH_VERSION=cuda" > .env
	@echo "FRONTEND_PORT=$(FRONTEND_PORT)" >> .env
	@echo "VITE_FRONTEND_PORT=$(FRONTEND_PORT)" >> .env
	@echo "BACKEND_PORT=$(BACKEND_PORT)" >> .env
	@echo "VITE_BACKEND_PORT=$(BACKEND_PORT)" >> .env
	@echo "DOCS_PORT=$(DOCS_PORT)" >> .env
	@echo "CORS_ORIGINS=http://localhost:$(FRONTEND_PORT),http://frontend:$(FRONTEND_PORT)" >> .env
	@$(DOCKER_COMPOSE) down
	@$(DOCKER_COMPOSE) build --no-cache --build-arg TORCH_VERSION=cuda
	@$(DOCKER_COMPOSE) up -d
	@echo "✓ Switched to CUDA version"
