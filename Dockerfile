# Use the official Node.js image
FROM node:18-alpine

# Install curl (download tool)
RUN apk add --no-cache curl

# Enable Corepack and prepare Yarn version 4.9.1
RUN corepack enable && corepack prepare yarn@4.9.1 --activate

# Ensure the .yarn/releases directory exists and download the correct Yarn version
RUN mkdir -p /app/.yarn/releases \
    && curl -L https://repo.yarnpkg.com/4.9.1/packages/yarnpkg-cli/bin/yarn.js -o /app/.yarn/releases/yarn-4.9.1.cjs

# Set the working directory
WORKDIR /app

# Copy Yarn configuration and package files to leverage Docker cache
COPY package.json yarn.lock .yarnrc.yml ./

# Set Yarn registry to ensure the correct registry is used
RUN yarn config set npmRegistryServer "https://registry.yarnpkg.com"

# Clean Yarn cache to avoid any unexpected issues
RUN yarn cache clean --all

# Install dependencies without using --immutable-cache
RUN yarn install --network-timeout 100000

# Copy the entire project source
COPY . .

# Ensure permissions for SWC cache directory (avoid permission errors)
RUN mkdir -p /root/.cache/next-swc && chmod -R 777 /root/.cache/next-swc

# Build the project
RUN yarn build

# Expose port 3000 (default for Next.js)
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]
