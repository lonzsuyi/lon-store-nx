FROM node:23.1-alpine as builder

RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml ./

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
RUN pnpm install --frozen-lockfile
RUN pnpm install --filter lon-store-components --frozen-lockfile

COPY . .

# RUN pnpm nx build lon-store --prod 
# # # Build Express API (outputs to dist/apps/lon-store-middleware)
# RUN pnpm nx build lon-store-middleware --prod 
# # # Build Storybook (outputs to dist/libs/lon-store-components)
# RUN pnpm nx run lon-store-components:build-storybook 

# # # ----------- FINAL RUNTIME IMAGE -------------
# FROM node:23.1-alpine AS runner

# WORKDIR /app

# RUN corepack enable && corepack prepare pnpm@latest --activate

# ENV PNPM_HOME="/root/.local/share/pnpm"
# ENV PATH="$PNPM_HOME:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

# RUN apk add --no-cache tini
# RUN pnpm add serve -g
# # RUN apt install xsel


# COPY --from=builder /app/apps/lon-store /app/apps/lon-store
# COPY --from=builder /app/dist/apps/lon-store-middleware /app/api
# COPY --from=builder /app/dist/libs/lon-store-components /app/storybook
# COPY --from=builder /app/package.json /app/
# COPY --from=builder /app/node_modules /app/node_modules

# EXPOSE 3000 4000 6006

# CMD ["tini", "--", "sh", "-c", "pnpm next start ./apps/lon-store/ -p 3000 &  PORT=4000 node /app/api/main.js  & pnpm serve /app/storybook -l 6006"]
