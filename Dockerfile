# ---------- Build stage ----------
    FROM node:22-alpine AS builder

    WORKDIR /app
    
    # Copy dependencies and install (including dev)
    COPY package*.json ./
    
    # Copy source
    COPY . .
    
    # Build app using local Nest CLI
    RUN npm install
    
    # ---------- Production stage ----------
    FROM node:22-alpine
    
    WORKDIR /app
    
    # Copy only what's needed
    COPY --from=builder /app/package*.json ./
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/dist ./dist
    
    # Use non-root user
    RUN addgroup -S appgroup && adduser -S appuser -G appgroup
    USER appuser
    
    EXPOSE 3000
    
    CMD ["node", "dist/main"]
    