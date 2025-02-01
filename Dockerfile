# Use Node.js 23 base image
FROM node:23.1.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build Next.js
RUN yarn build

# Expose port for Next.js (3000), Storybook (6006), and Express (4000)
EXPOSE 3000 6006 4000

# Set the default command to run Next.js
CMD ["yarn", "dev"]