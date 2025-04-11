# ---------- Build stage ----------
    FROM node:22-alpine AS builder

    WORKDIR /app
    
    # Copy package files first for better caching
    COPY package.json package-lock.json ./
    
    # Install dependencies (no optional deps, faster)
    RUN npm ci --omit=optional
    
    # Copy only source code
    COPY . .
    
    # Build NestJS app
    RUN npm run build
    
    # ---------- Production stage ----------
    FROM node:22-alpine AS production
    
    WORKDIR /app
    
    # Create non-root user
    RUN addgroup -S appgroup && adduser -S appuser -G appgroup
    
    # Copy necessary files only
    COPY --chown=appuser:appgroup --from=builder /app/package*.json ./
    COPY --chown=appuser:appgroup --from=builder /app/node_modules ./node_modules
    COPY --chown=appuser:appgroup --from=builder /app/dist ./dist
    
    # Switch to non-root
    USER appuser
    
    EXPOSE 3000
    
    CMD ["node", "dist/main"]
    