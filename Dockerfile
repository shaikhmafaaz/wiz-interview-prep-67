
# Multi-stage build for the frontend
FROM node:18-alpine as frontend-builder

WORKDIR /app/frontend
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Python backend stage
FROM python:3.9-slim as backend-builder

WORKDIR /app/backend
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

# Final stage with nginx
FROM nginx:alpine

# Install Python and dependencies
RUN apk add --no-cache python3 py3-pip supervisor

# Copy Python requirements and install
COPY backend/requirements.txt /app/backend/
RUN pip3 install --no-cache-dir -r /app/backend/requirements.txt

# Copy backend code
COPY backend/ /app/backend/

# Copy built frontend
COPY --from=frontend-builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy supervisor configuration
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Create necessary directories
RUN mkdir -p /app/backend/database

# Expose port 80
EXPOSE 80

# Start supervisor to manage both nginx and python processes
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
