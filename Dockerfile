# Specify the base Docker image for Node.js Actor without browser
# Using standard Node.js image since we don't need Puppeteer anymore
FROM apify/actor-node:22 AS builder

# Set working directory
WORKDIR /home/myuser

# Check preinstalled packages (apify should be available)
RUN npm ls apify || true

# Copy just package.json and package-lock.json
# to speed up the build using Docker layer cache.
COPY --chown=myuser:myuser package*.json ./

# Install all dependencies. Don't audit to speed up the installation.
RUN npm install --include=dev --audit=false

# Next, copy the source files using the user set
# in the base image.
COPY --chown=myuser:myuser . ./

# Build the project and verify dist directory was created
RUN echo "Current directory:" && pwd && \
    echo "Files before build:" && ls -la && \
    npm run build && \
    echo "Files after build:" && ls -la && \
    echo "Checking dist directory..." && \
    if [ ! -d "dist" ]; then \
        echo "ERROR: dist directory not found after build!" && \
        echo "Contents of current directory:" && ls -la && \
        exit 1; \
    fi && \
    echo "dist directory found:" && ls -la dist/

# Create final image
FROM apify/actor-node:22

# Set working directory
WORKDIR /home/myuser

# Check preinstalled packages (apify should be available)
RUN npm ls apify || true

# Copy just package.json and package-lock.json
# to speed up the build using Docker layer cache.
COPY --chown=myuser:myuser package*.json ./

# Install NPM packages, skip optional and development dependencies to
# keep the image small. Avoid logging too much and print the dependency
# tree for debugging
RUN npm --quiet set progress=false \
    && npm install --omit=dev --omit=optional \
    && echo "Installed NPM packages:" \
    && (npm list --omit=dev --all || true) \
    && echo "Node.js version:" \
    && node --version \
    && echo "NPM version:" \
    && npm --version \
    && rm -r ~/.npm

# Copy built JS files from builder image
# Verify dist exists in builder before copying
COPY --from=builder --chown=myuser:myuser /home/myuser/dist ./dist

# Next, copy the remaining files and directories with the source code.
# Since we do this after NPM install, quick build will be really fast
# for most source file changes.
COPY --chown=myuser:myuser . ./

CMD ["node", "dist/main.js"]
