# Development build for WarpTorch Backend
FROM python:3.12-slim

# Build argument to choose between CPU and CUDA versions
ARG TORCH_VERSION=cpu

WORKDIR /app

# Install system dependencies including build tools for development
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgomp1 \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install PyTorch based on TORCH_VERSION argument
RUN if [ "${TORCH_VERSION}" = "cuda" ]; then \
        pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cu121; \
    elif [ "${TORCH_VERSION}" = "rocm" ]; then \
        pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/rocm6.0; \
    else \
        pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu; \
    fi

# Install Python dependencies including dev tools
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir uvicorn[standard] && \
    rm -rf /root/.cache/pip

# Copy application code
COPY core/ ./core/
COPY backend/ ./backend/

# Create non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8099

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8099/health')" || exit 1

# Run the application in development mode with hot reload
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8099", "--reload"]
