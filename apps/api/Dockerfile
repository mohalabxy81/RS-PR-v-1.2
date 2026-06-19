# ─────────────────────────────────────────────
# Stage 1: Dependency installer
# ─────────────────────────────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy workspace manifests first for layer caching
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/

RUN npm ci --omit=dev --ignore-scripts && \
    # Also install devDeps needed for prisma generate
    npm install --ignore-scripts

# ─────────────────────────────────────────────
# Stage 2: Builder
# ─────────────────────────────────────────────
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client (requires openssl)
ENV DATABASE_URL="postgresql://placeholder:placeholder@placeholder:5432/placeholder"
RUN npx prisma generate --schema=apps/api/prisma/schema.prisma

# Compile TypeScript
RUN npm run build --workspace=apps/api

# Prune dev dependencies
RUN npm prune --omit=dev

# ─────────────────────────────────────────────
# Stage 3: Production runner (minimal surface)
# ─────────────────────────────────────────────
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat openssl dumb-init

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3001

# Copy production artifacts
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/package.json ./package.json
# Copy Prisma artifacts needed at runtime
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/node_modules/.prisma ./.prisma

USER nestjs

EXPOSE 3001

# dumb-init for proper PID 1 and signal handling
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist/main"]

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3001/api/health || exit 1
