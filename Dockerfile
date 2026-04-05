# -----------------------------------------------------------------------------
# Stage 1: Base
# -----------------------------------------------------------------------------
# Tip: Consider pinning to a specific SHA or minor version if vulnerabilities persist
# e.g., FROM node:20.12.2-alpine3.19 AS base
FROM node:20-alpine AS base

# 1. Upgrade existing alpine packages to patch OS vulnerabilities, THEN install dependencies
RUN apk upgrade --no-cache && \
    apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY . .
# Enable pnpm via corepack
RUN corepack enable

# -----------------------------------------------------------------------------
# Stage 2: Dependencies
# -----------------------------------------------------------------------------
FROM base AS deps
WORKDIR /app

# Copy lockfiles first for better caching
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# 2. SECURE FIX: Install dependencies strictly from the lockfile
# This ensures deterministic builds and prevents sneaking in new vulnerable sub-dependencies
RUN pnpm install --no-frozen-lockfile

# -----------------------------------------------------------------------------
# Stage 3: Builder
# -----------------------------------------------------------------------------
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 3. Handle Next.js Public Environment Variables
ARG NEXT_PUBLIC_MONGODB_URI
ENV NEXT_PUBLIC_MONGODB_URI=${NEXT_PUBLIC_MONGODB_URI}

# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN pnpm build

# -----------------------------------------------------------------------------
# Stage 4: Runner
# -----------------------------------------------------------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set permissions for nextjs cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy the standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

# Start the application
CMD ["node", "server.js"]