# ---------- Build stage ----------
    FROM node:22-alpine AS builder

    WORKDIR /app
    
    # Copy package files first for better caching
    COPY package*.json ./
    
    # Install dependencies
    RUN npm install
    
    # Copy source code
    COPY . .
    
    # Build app
    RUN npm run build
    # หรือใช้ npx nest build ถ้า package.json ไม่มี build script
    
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