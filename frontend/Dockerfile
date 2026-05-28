FROM node:20-alpine

WORKDIR /app/frontend

# Copy package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY frontend/ ./

# Expose port
EXPOSE 3005

# Work in the frontend directory for Vite
WORKDIR /app/frontend

# Run Vite dev server
CMD ["npm", "run", "dev"]
