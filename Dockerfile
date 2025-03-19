# Stage 1: Build the application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies (necessary for bcrypt)
RUN apk add --no-cache --virtual .build-deps gcc g++ make python3

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild bcrypt for the correct platform
RUN yarn add bcrypt

# Copy the rest of the application source code
COPY . .

# Build the Next.js application
RUN yarn build

# Install only production dependencies
# RUN yarn install --production --frozen-lockfile

# Stage 2: Create a lightweight production image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy necessary files from the build stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/node_modules ./node_modules

# Set environment variables
ENV NODE_ENV production
ENV PORT 3000

# Expose the application port
EXPOSE 3000

# Start the Next.js application
CMD ["yarn", "start"]
