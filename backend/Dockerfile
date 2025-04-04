FROM node:23-alpine

# Install openssl if needed
RUN apk add --no-cache openssl

# Set the working directory to /app
WORKDIR /app

# Copy the root package.json and package-lock.json for dependency installation
COPY package.json package-lock.json ./

# Copy the backend's package.json
COPY backend/package.json ./backend/

# Copy the shared folder (for types) if necessary
COPY shared ./shared

# Copy the entire backend codebase
COPY backend ./backend

# Install all dependencies from the root
RUN npm install --frozen-lockfile

# Build only the backend
WORKDIR /app/backend
RUN npm run build

# Expose the backend port
EXPOSE 3000

# Start the backend service
CMD ["node", "dist/index.js"]
