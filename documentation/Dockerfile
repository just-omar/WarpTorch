FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all documentation files
COPY . .

# Expose port
EXPOSE 3553

# Start Docusaurus with HMR optimizations and polling for Docker
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--no-minify", "--poll", "1000"]
