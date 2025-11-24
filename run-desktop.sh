#!/bin/bash

echo "Building and running Dashboard Portofolio Desktop in production mode..."
echo

echo "Step 1: Building Next.js app..."
npm run build
if [ $? -ne 0 ]; then
    echo "Build failed! Please check for errors."
    exit 1
fi

echo
echo "Step 2: Starting Next.js and Electron together..."
npm run desktop:prod