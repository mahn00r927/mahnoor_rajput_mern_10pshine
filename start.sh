#!/bin/bash
# Backend
cd backend
npm install
node index.js &

# Frontend
cd ../frontend
npm install
npm run build
npx serve -s build -l 3000
