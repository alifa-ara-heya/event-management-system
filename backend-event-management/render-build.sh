#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -o errexit

# Install dependencies
npm install

# Build project
npm run build

# Generate Prisma client
npx prisma generate

# Deploy Prisma migrations
npx prisma migrate deploy
