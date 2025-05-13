# ----- STEP 1: Define the base image
FROM node:23-alpine AS base

# ----- STEP 2: Install necessary packages
FROM base AS deps
WORKDIR /app

# Copy dependencies
COPY package*.json ./
RUN npm ci

# ----- STEP 3: Build the application

# Arguments handed out by docker compose
ARG MONGODB_URI_BUILD_ARG
ARG DB_NAME_BUILD_ARG
ARG NEXT_PUBLIC_GRAPHQL_ENDPOINT_BUILD_ARG

FROM base AS builder
WORKDIR /app

# Copy the dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_VERBOSE=1

# Build the Next.js app
RUN npm run build

# ----- STEP 4: Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a user and a group for the application
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy only the necessary files from the builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Change user to the newly created non-root user
USER nextjs

ENV PORT=3000
EXPOSE 3000

CMD ["node", "server.js"]