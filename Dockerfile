# ----- STEP 1: Define the base image
# A lean and secure basis for all subsequent steps.
FROM node:23-alpine AS base

# ----- STEP 2: Install necessary packages
# Isolates the installation of dependencies to make optimal use of the Docker cache.
FROM base AS deps
WORKDIR /app

# Copy dependencies
COPY package*.json ./
RUN npm ci

# ----- STEP 3: Build the application
# Build the application. This stage receives ONLY the variables that are absolutely necessary for the build process.
FROM base AS builder
WORKDIR /app

# Arguments handed out by docker compose
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_VERBOSE=1

# Copy the dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the Next.js app
RUN npm run build

# ----- STEP 4: Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# Create a user and a group for the application
RUN addgroup -S -g 1001 nodejs
RUN adduser -S -u 1001 -G nodejs nextjs

# Environmental Variables

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Copy only the necessary files from the builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Change user to the newly created non-root user
USER nextjs

CMD ["node", "server.js"]