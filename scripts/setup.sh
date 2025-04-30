#!/bin/bash

# Initialize the project
echo "Setting up ZEMS project..."

# Install extension dependencies
echo "Installing extension dependencies..."
cd extension
npm install
cd ..

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

# Create development database
echo "Initializing development database..."
mkdir -p data
sqlite3 data/emails.db "VACUUM;"

echo "Setup complete!"