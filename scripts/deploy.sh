#!/bin/bash

# Build and deploy script for ZEMS

# Build extension
echo "Building extension..."
cd extension
npm run build
cd ..

# Build backend
echo "Building backend..."
cd backend
npm run build
cd ..

# Package for deployment
echo "Packaging for deployment..."
mkdir -p deploy
cp -r extension/dist deploy/extension
cp -r backend/dist deploy/backend
cp -r backend/package.json deploy/backend
cp scripts/run-production.sh deploy/

echo "Deployment package created in deploy/"