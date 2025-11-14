# Stage 1: Build the frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 2: Build the backend
FROM node:20-slim AS backend-builder
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json* ./
RUN npm install
COPY backend/ .
RUN tsc

# Stage 3: Create the final production image
FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production

# Copy the built frontend assets
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Copy the built backend
COPY --from=backend-builder /app/backend/dist ./backend/dist

# Install backend production dependencies
COPY backend/package.json backend/package-lock.json* ./backend/
RUN cd backend && npm install --production

# Set working directory to backend
WORKDIR /app/backend

# Expose the port Cloud Run expects
ENV PORT=8080
CMD ["node", "dist/server.js"]