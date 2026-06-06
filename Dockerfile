# Use Node.js LTS (Slim version for better Prisma compatibility)
FROM node:20-slim

# Install OpenSSL (required by Prisma)
RUN apt-get update -y && apt-get install -y openssl

# Set the working directory
WORKDIR /app

# Copy package files from the backend directory
COPY backend/package*.json ./
COPY backend/prisma ./prisma/

# Install dependencies
RUN npm install

# Copy the rest of the backend source code
COPY backend/ ./

# Generate Prisma client
RUN npx prisma generate

# Build the NestJS app
RUN npm run build

# Hugging Face Spaces expect apps to run on port 7860 by default
EXPOSE 7860
ENV PORT=7860

# Command to run the application
CMD ["npm", "run", "start"]
