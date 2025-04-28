# Base image
FROM node:20-alpine AS base

ENV NODE_ENV=production

# Install pnpm globally
RUN npm install -g pnpm

# Builder stage
FROM base AS builder
WORKDIR /app

# Copy only the dependency-related files for better cache
COPY package.json pnpm-lock.yaml ./

# Install all dependencies including dev ones
RUN pnpm install

# Copy the full source code
COPY . .

# Generate Prisma client
RUN pnpm exec prisma generate

# Compile TypeScript to dist/
RUN pnpm run build

# Remove dev dependencies
RUN pnpm prune --prod

# Runner stage
FROM base AS runner
WORKDIR /app

# Copy compiled code and runtime deps only
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

# Expose your app's port
EXPOSE 8000

# Exec entry.sh
COPY entry.sh ./entry.sh
RUN chmod +x ./entry.sh

ENTRYPOINT ["./entry.sh"]