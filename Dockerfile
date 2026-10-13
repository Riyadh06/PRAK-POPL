# ==========================================
# 1. Base Image: Node.js 20 Alpine (Ringan & Cepat)
# ==========================================
FROM node:20-alpine AS base

# Install libc6-compat jika dibutuhkan oleh dependency tertentu di Alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ==========================================
# 2. Stage Dependencies
# ==========================================
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ==========================================
# 3. Stage Builder
# ==========================================
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Nonaktifkan telemetry Next.js saat build
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ==========================================
# 4. Stage Runner (Production)
# ==========================================
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Tambahkan user non-root demi keamanan
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Salin public dan file hasil build Next.js
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "run", "start"]
