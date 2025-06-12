# ---- Base Stage ----
# Sets up the base environment with Node.js 22 on Alpine, a lightweight Linux distribution.
# It installs all dependencies, including development ones, to be used by subsequent stages.
FROM node:22-alpine AS base
WORKDIR /usr/src/app

# Copy package manifests and lock file. This is done first to leverage Docker's layer caching.
# If these files don't change, Docker will reuse the cached layers, speeding up builds.
COPY --chown=node:node package.json yarn.lock ./

# Install all dependencies (including devDependencies) using yarn.
# --frozen-lockfile ensures that the exact versions in yarn.lock are installed.
RUN yarn install --frozen-lockfile

# ---- Build Stage ----
# This stage is responsible for building the NestJS application.
# It copies source code and uses the dependencies from the 'base' stage to create a production-ready build.
FROM base AS build

# Copy the rest of the application's source code.
# By copying dependencies first and then the code, we ensure that changes in the code
# don't trigger a full dependency re-installation.
COPY --chown=node:node . .

# Generate the Prisma client. This step is crucial to ensure that the Prisma client
# is up-to-date with your schema and available for the application build.
RUN yarn prisma generate

# Run the build script defined in package.json (usually `nest build`).
# This transpiles the TypeScript code into JavaScript, placing it in the /dist folder.
RUN yarn run build

# ---- Production Dependencies Stage ----
# This stage's purpose is to create a clean `node_modules` directory with only production dependencies.
FROM base AS prod-deps

# Re-install dependencies, but this time only for production.
# The `--production` flag skips devDependencies, resulting in a smaller node_modules folder.
RUN yarn install --production --frozen-lockfile

# ---- Production Stage ----
# This is the final stage that creates the lean image to be deployed.
# It uses the slim Alpine version of Node.js 22 for a smaller footprint.
FROM node:22-alpine AS production
WORKDIR /usr/src/app

# Set the NODE_ENV to 'production' to enable production-specific optimizations in NestJS and other libraries.
ENV NODE_ENV production

# Install OpenSSL, a runtime dependency for Prisma's query engine on Alpine.
RUN apk add --no-cache openssl

# Copy the user and group from the node image.
COPY --from=build /etc/passwd /etc/passwd
COPY --from=build /etc/group /etc/group

# Copy the production dependencies from the 'prod-deps' stage.
COPY --chown=node:node --from=prod-deps /usr/src/app/node_modules ./node_modules

# Copy the compiled application code from the 'build' stage.
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# Copy the Prisma schema. It's needed at runtime for the Prisma client.
COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma

# Copy package.json for runtime access (e.g., by monitoring tools or libraries).
COPY --chown=node:node --from=build /usr/src/app/package.json ./

# Copy the generated Prisma client from the 'build' stage. This is crucial. 
COPY --chown=node:node --from=build /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# Switch to the non-root 'node' user for better security.
USER node

# Expose the port the application will run on.
EXPOSE 3000

# The command to start the application.
# It runs the main entry point of the compiled NestJS application.
CMD [ "node", "dist/main.js" ]