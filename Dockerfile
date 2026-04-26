# Stage 1: Build
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# Copy package files and install ALL dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the code and build it (NestJS compiles TS to JS)
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:22-bookworm-slim AS runner

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy only the compiled code and production dependencies from the builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
RUN npm ci --only=production

# Expose the port your NestJS app runs on (usually 3000)
EXPOSE 3000

# Run the app
CMD ["node", "dist/main"]