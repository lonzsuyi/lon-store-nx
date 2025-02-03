# --- Build Stage ---
FROM node:23.1-alpine AS builder

# Set working directory
WORKDIR /app

RUN npm install -g pnpm

# Install tini to prevent zombie processes
# RUN apk add --no-cache tini

# Copy package.json & pnpm-lock.yaml and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy all project files
COPY . .

RUN pnpm nx reset

RUN NX_DAEMON=false NX_VERBOSE_LOGGING=true pnpm nx build lon-store --prod

# Build Storybook with Nx Daemon disabled
RUN NX_DAEMON=false NX_VERBOSE_LOGGING=true pnpm nx run lon-store-components:build-storybook

# Disable Nx Daemon to prevent Docker build failures
RUN NX_DAEMON=false NX_VERBOSE_LOGGING=true pnpm nx run lon-store-middleware:build

# --- Production Stage ---
FROM node:23.1-alpine AS runner

WORKDIR /app

# Install pnpm directly to avoid Corepack issues
RUN npm install -g pnpm
RUN pnpm add serve

# Install tini for process management
RUN apk add --no-cache tini

# - Copy built artifacts -
# Copy lon-store-middleware artifacts
COPY --from=builder /app/dist/apps/lon-store-middleware /app/lon-store-middleware
# Copy lon-store-components artifacts
COPY --from=builder /app/libs/lon-store-components/storybook-static /app/book-static
# Copy lon-store artifacts
COPY --from=builder /app/apps/lon-store/.next /app/lon-store/.next
COPY --from=builder /app/apps/lon-store/public /app/lon-store/public
COPY --from=builder /app/apps/lon-store/package.json /app/
COPY --from=builder /app/node_modules /app/node_modules

# Expose ports 3000:lon-store 4000:lon-store-middleware 6006:lon-store-components
EXPOSE 3000 4000 6006

# Start Next.js(lon-store) and (lon-store-components)Storybook and (lon-store-middle)Express
CMD ["tini", "--", "sh", "-c", "pnpm serve /book-static -l 6006 & node lon-store-middleware/main.js & pnpm next start lon-store -p 3000"]

