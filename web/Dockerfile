ARG NODE_VERSION=18.18.2

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine AS base

# Set working directory for all build stages.
WORKDIR /usr/src/app

################################################################################
# Create a stage for installing production dependencies.
FROM base AS deps

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.yarn to speed up subsequent builds.
# Leverage bind mounts to package.json and yarn.lock to avoid having to copy them
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
   --mount=type=bind,source=yarn.lock,target=yarn.lock \
   --mount=type=cache,target=/root/.yarn \
   yarn install --frozen-lockfile

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM base AS final

# Use production node environment by default.
ENV NODE_ENV=production
ENV ORIGIN=https://example.com

# Run the application as a non-root user.
# USER node

COPY . .

# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
COPY --from=deps /usr/src/app/node_modules ./node_modules

# RUN mkdir /usr/src/app/node_modules/.vite && chown -R node:node /usr/src/app/node_modules/.vite
# RUN chmod -R u+rw /usr/src/app/node_modules/.vite

# Expose the port that the application listens on.
EXPOSE 5000

# Run the application.
CMD yarn dev --host 0.0.0.0 --port 5000