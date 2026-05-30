# Jupyter notebook with WarpTorch dependencies
FROM jupyter/datascience-notebook:latest

# Switch to root user to install system dependencies
USER root

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt /tmp/requirements.txt

# Install PyTorch (CPU version by default for compatibility)
# Can be overridden with build arg: TORCH_VERSION=cuda or rocm
ARG TORCH_VERSION=cpu
RUN if [ "${TORCH_VERSION}" = "cuda" ]; then \
        pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cu121; \
    elif [ "${TORCH_VERSION}" = "rocm" ]; then \
        pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/rocm6.0; \
    else \
        pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu; \
    fi

# Install Python dependencies from requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt && \
    rm -rf /root/.cache/pip /tmp/requirements.txt

# Switch back to jovyan user
USER jovyan

# Set working directory
WORKDIR /home/jovyan

# Copy Jupyter startup configuration for automatic imports
COPY .ipython /home/jovyan/.ipython

# Expose port
EXPOSE 8888
